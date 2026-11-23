# South Colours SQL Server installation wizard

## Scope and repository entry points

Implement an operator-only wizard for Microsoft SQL Server. It initializes new deployments and supports an explicitly approved empty replacement for an installed database that is confirmed missing. It also supports restore as a separate recovery operation. The wizard uses the existing application database for both commerce and ASP.NET Core Identity.

| Existing component | Implementation decision |
| --- | --- |
| [API startup](../../backend/Southcolours.API/Program.cs) | Keep `UseSqlServer` and the `DefaultConnection` configuration contract. Remove production startup migrations and the public `GET /api/seed` endpoint. Add database-aware readiness. |
| [EF context](../../backend/Southcolours.Persistence/Context/ApplicationDbContext.cs) | Reuse the shared Identity and commerce model. |
| [SQL Server initial migration](../../backend/Southcolours.Persistence/Migrations/20261018163847_InitialCreate.cs) | Keep its ID and snapshot history. Add a new migration for bootstrap state and seed records. |
| [Seeder](../../backend/Southcolours.Persistence/Seed/DatabaseSeeder.cs) | Reuse the required role names. Extract sample data into an explicitly selected, versioned seed profile. Remove the built-in administrator credentials. |
| [Angular routes](../../frontend/southcolours-angular/src/app/app.routes.ts) | Use the existing `/auth/login` route after completion. |
| [VPS workflow](../../.github/workflows/deploy.yml) and [Render blueprint](../../render.yaml) | Integrate an authorized maintenance runner into the release path for the actual SQL Server deployment. |

This file is the SQL Server plan. The earlier phased documents also cover PostgreSQL. PostgreSQL migrations and the Supabase SQL script are outside this implementation.

## Phase 1 · Inventory, readiness, and safe rollout

1. Record the actual SQL Server instance or managed endpoint, expected database name, owner, current schema and EF history, production authentication mode, runtime permissions, and backup coverage. Verify backup restore on an isolated target. Include uploaded files and `store_settings.json` in the backup inventory.
2. Use explicit SQL Server configuration for the wizard. Validate the target against deployment configuration. Use `SqlConnectionStringBuilder`, verified TLS certificates, bounded probe timeouts, and sanitized diagnostic codes.
3. Separate process liveness from readiness. Readiness checks the expected database, installation marker, runtime access, and schema compatibility. Database-dependent API endpoints return a generic 503 during installation, outage, or incompatible schema.
4. Remove the anonymous seed route and default admin and JWT signing credentials. Review server-side admin authorization, login throttling, and allowed frontend origins. Rotate deployed secrets if defaults were previously used.
5. Roll out adoption and readiness together. First register and verify existing production targets, then enforce matching installation markers and replace API startup writes with the maintenance runner. Preserve existing credentials and data during adoption.

**Exit criteria:** An unavailable database triggers 503 and restricted diagnostics. The public API cannot provision, migrate, or seed. Existing deployments pass readiness after adoption.

## Phase 2 · State, locking, and SQL Server migrations

Create `backend/Southcolours.Installation/` for the private wizard and its CLI entry point. Keep migrations and seed logic in `Southcolours.Persistence`. Reuse Identity services for account creation.

- Store a durable external record with deployment ID, installation ID, approved SQL Server target, current operation ID and checkpoint, expected release, secret reference, and audit history. On a VPS this can use a protected persistent state directory for a single operations host. For multiple runners use a shared durable store. Back it up independently of SQL Server.
- In SQL Server, store the matching installation ID, bootstrap completion record, versioned seed ledger, and EF's `__EFMigrationsHistory`. Record approvals and sanitized outcomes externally so they survive deletion.
- Acquire a deployment-scoped lock in the external state store before target discovery or creation. Hold it through finalization and use EF migration locking for schema changes. Bind approval to the operation ID and approved target. Reject stale approvals and concurrent attempts.
- Package a release-pinned SQL Server migration artifact in CI. The maintenance runner invokes it after approval using a schema migration identity. Confirm the target is the intended writable database and verify the applied migration IDs before bootstrapping.
- Preserve the existing initial migration. Empty databases receive the full versioned migration chain. Upgrades apply pending migrations only. A populated database with missing or conflicting EF history requires an adoption review on a restored copy before any baseline is recorded.
- Checkpoint each operation. Database creation and external-state updates cannot share one transaction. After interruption, resume against the same verified target and reconcile durable records before proceeding. If a catalog appears after an interrupted create and ownership is uncertain, stop for operator review.

**Exit criteria:** CI can migrate a fresh SQL Server database and upgrade a prior-release copy. A second runner cannot mutate the target during an active operation. An unknown database or migration history cannot trigger bootstrap.

## Phase 3 · Wizard screens and execution

Host the wizard privately in an operations environment. On the VPS, bind it to loopback and reach it over SSH. Authenticate the operator independently of application Identity, which may be unavailable. Use expiring setup sessions, CSRF protection, protected secret inputs, and restricted audit logs.

| Screen | Operator interaction and server behavior |
| --- | --- |
| Connection | Show Microsoft SQL Server, instance or endpoint, database, authentication mode, and **Test connection**. Validate the approved destination, test TLS and permissions, and distinguish an existing empty catalog, an existing installation, verified absence, and an unresolved failure. |
| Review | Show the exact target and planned work. For an installed database confirmed missing, present **Restore backup** and **Start fresh**. Starting fresh requires explicit data-loss approval bound to the target. Collect the first administrator's email and a strong password through protected inputs before running bootstrap. |
| Install | Acquire the lock and revalidate the target. Create the catalog with a short-lived provisioning identity if permitted, or attach an approved empty catalog provisioned by the operator. Apply SQL Server migrations automatically, seed the selected data, create the first administrator, and verify readiness using runtime credentials. Show sanitized stage progress and a resumable operation reference on failure. |
| Complete | Record the release, installation ID, and outcome. Revoke temporary access, invalidate the setup session, stop the installer listener, and redirect to the configured Angular `/auth/login` route. |

Use separate provisioning, migration, and API runtime permissions. The API runtime identity needs application data access and enough access to read readiness markers. Store secrets outside source control and avoid passing credentials in process arguments or logging connection strings.

### Seeding and first administrator

1. Seed `SuperAdmin`, `ProductManager`, `OrderManager`, and `Customer` using stable keys. Give each seed version an immutable identifier and commit its ledger entry with the data. Reapplying a completed seed must preserve operator edits.
2. If the operator wants starter catalog data, expose an explicit seed profile during review. Inventory which existing categories, products, banners, and coupons belong in that profile. Keep sample coupons out of production defaults. Treat the profile as new data. Historical products, customers, orders, and payments require a restore.
3. After migrations and required seeds succeed, create the operator-selected user with `UserManager` and assign `SuperAdmin` through Identity. Check every result. Commit creation, membership, and the bootstrap completion marker in the same target transaction. Stop for review on an existing email without matching bootstrap evidence.
4. At completion verify the migration history, seed ledger, bootstrap result, and target installation ID. If the database completed before the external record was updated, reconcile and finalize without rerunning administrator creation.

**Exit criteria:** After approval, a clean SQL Server database reaches the login screen without manual EF commands. Migration failure prevents seeding, admin creation, and traffic enablement. Retrying after interruption produces one installation and one initial administrator.

## Phase 4 · Deployment and automatic upgrades

1. Publish the API, installer, and matching migration artifact as a release. On the VPS, insert the runner before release promotion and systemd restart. For Render-hosted workloads, run it from a trusted environment with access to SQL Server and the deployment secret store. If the host reserves database creation, require an operator-provisioned catalog.
2. Before upgrades, hold the deployment lock, confirm the target identity and migration history, verify the backup and rollback plan, and run pending migrations and versioned reference seeds automatically. Keep first-admin bootstrap exclusive to fresh installs and approved replacements.
3. Use additive migrations when old and new code must overlap. Gate traffic during incompatible changes. Promote after database and API readiness checks. Verify compatibility before application rollback. Use a reviewed forward fix or a restore plan for incompatible schema changes.

**Exit criteria:** A failed migration blocks promotion. Successful upgrades preserve data and existing administrators. Elevated credentials are absent from the public API service.

## Phase 5 · Confirmed loss, restore, and start fresh

1. On connection failure, keep setup closed. Use an authorized maintenance connection with sufficient catalog visibility on the recorded SQL Server instance. Rule out DNS, TLS, login, permissions, offline databases, and a wrong instance. A database-open failure alone is insufficient evidence of absence. Check server or provider audit records when attributing deletion.
2. For restore, approve a backup and restore to a separate target. Verify installation ID, schema, recovered data, and runtime permissions before switching the connection. Restore media and settings as needed and reconcile payment and order events before reopening checkout.
3. For start fresh, require explicit data-loss approval. Prefer a separately named empty catalog when the old database still exists. Allow reuse of the old name only after verifying it is absent on the recorded instance and rechecking immediately before creation. If a catalog appears, stop for review. The wizard does not drop or overwrite an existing database.
4. Run the normal install stages with a new installation ID. Retain the prior installation and incident history in the external audit record. Activate the replacement only after runtime verification and then close the wizard.

## Release verification

| Scenario | Expected result |
| --- | --- |
| Fresh database with provisioning privileges | Catalog and tables created, migrations recorded, selected seeds applied, first admin can sign in |
| Approved pre-provisioned empty catalog | Setup succeeds with schema migration permissions and without database creation privileges |
| Existing populated or foreign catalog | No initialization before explicit adoption review |
| Bad credentials, TLS failure, offline database, or inconclusive inventory | 503 on database-dependent routes, no create operation |
| Confirmed loss with no start-fresh approval | Recovery remains gated |
| Approved start fresh after confirmed loss | New installation ID, one-time seed, first admin, prior audit retained |
| Two operators or process interruption at each checkpoint | One active operation, retry resumes verified work without duplicate writes |
| Migration or seed fails | Failed step reported safely, dependent steps blocked, no traffic cutover |
| Restore to separate target | Old installation ID retained, data verified before cutover |
| Completed permanent setup | Temporary wizard session and elevated access revoked |

Implement and verify these phases on an isolated SQL Server deployment before running the workflow against production.

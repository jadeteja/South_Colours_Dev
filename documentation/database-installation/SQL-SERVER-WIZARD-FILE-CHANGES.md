# SQL Server setup wizard file changes

Use this file map with the [SQL Server implementation plan](SQL-SERVER-IMPLEMENTATION-PLAN.md). All files below are proposed implementation changes. The wizard runs as a private ASP.NET Core application with server-rendered Razor Pages. The existing Angular storefront continues to provide the login page.

## Create the wizard project

Paths in this table are relative to `backend/Southcolours.Installation/`.

| Create | Responsibility |
| --- | --- |
| `Southcolours.Installation.csproj`, `Program.cs` | Add the .NET 10 private wizard host and CLI entry point. Wire Persistence and Identity services, validated options, operator authentication, and the loopback listener. Keep operator execution separate from public API startup. |
| `Pages/_ViewImports.cshtml`, `Pages/_ViewStart.cshtml`, `Pages/Shared/_Layout.cshtml`, `wwwroot/css/setup.css` | Share the South Colours header, accessible four-step navigation, page layout, and visual styling. Derive the current and completed steps from server state. |
| `Pages/Setup/Connection.cshtml` and `Connection.cshtml.cs` | Step 1. Show Microsoft SQL Server, approved endpoint and database, and a connection test result. Post the test with antiforgery protection. Store a sanitized probe result and advance only when the target has been verified. |
| `Pages/Setup/Review.cshtml` and `Review.cshtml.cs` | Step 2. Show the exact target and the planned action. Present restore and start-fresh choices for confirmed loss. Bind explicit approval to the operation and target. Collect first-admin input through a protected form and exclude the password from persistent operation state. |
| `Pages/Setup/Install.cshtml` and `Install.cshtml.cs` | Step 3. Start or resume the approved operation through a protected POST. Show progress for catalog creation, migrations, seeding, administrator creation, and verification. Make progress reads read-only and prevent premature continuation. |
| `Pages/Setup/Complete.cshtml` and `Complete.cshtml.cs` | Step 4. Show completion only after verification and durable finalization. Close privileged setup access and redirect to the configured Angular `/auth/login` URL, validated against the deployment's approved frontend origin. |
| `SqlServer/SqlServerTargetProbe.cs` | Use validated SQL Server options and a trusted maintenance connection to classify verified absence, existing catalog, offline status, or an unresolved connectivity or permission failure. Verify instance identity and adequate catalog visibility. |
| `SqlServer/SqlServerProvisioner.cs` | Create an approved absent catalog using a temporary provisioner. Attach a pre-provisioned catalog only after checking it is empty in the application scope. Stop if an unexpected catalog appears. |
| `Operations/InstallationRunner.cs` | Coordinate locks, checkpoint updates, target validation, provisioning, migrations, seeds, administrator bootstrap, runtime verification, and finalization. Both wizard and CLI call this runner. |
| `Operations/SqlServerMigrationRunner.cs` | Apply the release-pinned SQL Server migration chain with migration credentials. Verify EF migration history before handing off to seeding. |
| `Operations/FirstAdministratorBootstrap.cs` | Use Identity's `UserManager` and `RoleManager`. Check all results and commit the account, role membership, and bootstrap marker together. Stop for review if an existing email cannot be tied to this operation. |
| `Operations/InstallationStateStore.cs`, `Operations/InstallationRecord.cs` | Persist deployment ID, installation ID, approved target, operation checkpoints, lock ownership, approvals, and sanitized audit events outside SQL Server. Use an atomic shared store for multiple runners or protected durable storage with an exclusive lock for a single VPS runner. |
| `Operations/RecoveryRunner.cs` | Verify backup restore to a separate target or call the installation runner with a newly approved replacement operation. Preserve previous installation history. Never drop or overwrite a catalog. |

## Create shared persistence and readiness files

| Create | Responsibility |
| --- | --- |
| `backend/Southcolours.Persistence/Installation/InstallationMarker.cs` | Store the installation ID and bootstrap completion in the application database. |
| `backend/Southcolours.Persistence/Installation/SeedHistoryEntry.cs` | Store immutable seed IDs, applied time, and operation ID. Enforce uniqueness at the database level. |
| `backend/Southcolours.Persistence/Migrations/<timestamp>_AddInstallationTracking.cs` and matching `.Designer.cs` | Generate the SQL Server EF migration that adds the marker and seed ledger. Keep the existing initial migration intact. |
| `backend/Southcolours.API/Health/DatabaseReadinessCheck.cs` | Confirm runtime connectivity, matching installation ID, and compatible schema with bounded checks. Keep diagnostic details in restricted logs. |
| `backend/Southcolours.API/Middleware/DatabaseReadinessMiddleware.cs` | Return a generic 503 for database-dependent requests during incomplete setup, an outage, or an incompatible schema. Leave liveness available. |
| `backend/Southcolours.Tests/Installation/SqlServerInstallationTests.cs` | Cover clean installation, migration failure, retry and concurrent execution, unknown catalog, confirmed loss, and seed and admin uniqueness against isolated SQL Server test databases. |

## Change existing files

| Change | Required edit |
| --- | --- |
| [backend/Southcolours.slnx](../../backend/Southcolours.slnx) | Register the installer project. |
| [API Program.cs](../../backend/Southcolours.API/Program.cs) | Remove the public `GET /api/seed` route and production startup migration and seeding. Register readiness services and middleware, and remove fallback JWT credentials. Preserve the SQL Server provider and existing Identity integration. |
| [API appsettings.json](../../backend/Southcolours.API/appsettings.json) | Document non-secret option names. Inject the runtime connection and signing secret through deployment configuration. Keep provisioning and migration credentials in the maintenance environment. |
| [ApplicationDbContext.cs](../../backend/Southcolours.Persistence/Context/ApplicationDbContext.cs) | Register the installation marker and seed ledger with their keys and constraints. |
| [ApplicationDbContextModelSnapshot.cs](../../backend/Southcolours.Persistence/Migrations/ApplicationDbContextModelSnapshot.cs) | Let EF update the SQL Server snapshot when scaffolding the new migration. |
| [DatabaseSeeder.cs](../../backend/Southcolours.Persistence/Seed/DatabaseSeeder.cs) | Keep required Identity roles as versioned defaults. Record each seed transactionally. Remove built-in administrator credentials and make sample catalog data explicit and opt-in. |
| [Southcolours.Tests.csproj](../../backend/Southcolours.Tests/Southcolours.Tests.csproj) | Reference the installer and persistence projects where needed by the integration tests. |
| [VPS deploy workflow](../../.github/workflows/deploy.yml) | Package the SQL Server migration artifact with the release and run maintenance before promotion or service restart. Protect the external state directory and use readiness to gate promotion. |
| [Dockerfile.api](../../Dockerfile.api) | Update the solution restore inputs for the new project. Keep the public API image entry point separate from the installer. |
| [Render deployment guide](../../deployment/RENDER_DEPLOYMENT.md) | Replace startup auto-seeding instructions with the authorized SQL Server maintenance workflow. Describe how to provide an empty catalog when the provider controls catalog creation. |

Reuse the existing Angular `/auth/login` route. Publish the wizard only through the private operations host. The SQL Server flow uses EF migrations and does not invoke the Supabase schema script.

## Implementation order and checkpoints

1. **Foundations.** Add the installer project, state store, SQL Server probe, tracking migration, and readiness checks. Rehearse adoption on a backup copy before enforcing markers on existing deployments.
2. **Execution.** Implement provisioning, automatic migrations, required seeds, bootstrap, and final verification. Prove a clean install and an interrupted retry with the CLI before wiring browser actions.
3. **Screens.** Add Connection, Review, Install, and Complete. Test expiry, CSRF, server-side step gating, and automatic redirect. Keep the install screen read-only while work runs.
4. **Release.** Update build and deployment files. Switch from API startup writes to the maintenance runner as part of the rollout. Verify existing deployments still come up correctly.
5. **Recovery.** Exercise unresolved connection failure, confirmed absence, restore to a separate catalog, and an approved empty replacement. Verify old audit history survives and the replacement gets a new installation ID.

At final verification, a successful fresh install should require no manual EF command, a failed migration should block seeding and login handoff, and completing setup should revoke the temporary operator session.

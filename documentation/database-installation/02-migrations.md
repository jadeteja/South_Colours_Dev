# Phase 2 · Provider migrations and legacy adoption

**Dependency:** [Phase 1](01-readiness.md).

## Implementation

1. Keep the published SQL Server initial migration, its ID, and its model snapshot in `backend/Southcolours.Persistence/Migrations/`. Create a separate `backend/Southcolours.Persistence.PostgreSql/` migrations assembly and provider-specific snapshot from the same `ApplicationDbContext`.
2. Add explicit design-time provider selection. Scaffold each model change for both supported providers and generate release-pinned migration bundles or reviewed scripts in CI. Use a schema migration identity distinct from the API runtime identity.
3. Remove `database/supabase_tables.sql` from deployment instructions. Its schema drop and broad grants make it unsuitable for installation, upgrade, or recovery.
4. For a database created outside EF, inspect a restored copy. Compare table and column types, nullability, defaults, indexes, uniqueness, foreign keys, grants, and Identity metadata. Resolve mismatches with a reviewed migration plan. Record the baseline only after verifying the expected schema, preserving existing data and administrators.
5. Add a migration for the database installation marker and seed ledger. Coordinate marker creation for adopted deployments with the external deployment record in Phase 3.

## Acceptance criteria

- Both providers migrate from an empty database to the release schema.
- A representative prior-release database upgrades with existing customers, orders, and admins intact.
- A legacy PostgreSQL rehearsal records a baseline only after reconciliation. An unexpected or mismatched schema stops before application traffic is enabled.

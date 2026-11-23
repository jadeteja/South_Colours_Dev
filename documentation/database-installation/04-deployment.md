# Phase 4 · Deployment and upgrades

**Dependency:** [Phase 3](03-installer.md).

## Implementation

1. In CI, build an immutable API release and matching migration artifacts for each supported provider. Record migration IDs and publish the installer or maintenance artifact with the release.
2. Integrate the maintenance runner into `.github/workflows/deploy.yml` before the VPS API restart. Inject elevated credentials through the operations environment. Store installer state outside the checkout and application publish directory. Run the private setup wizard over SSH when operator input is required.
3. For Render, run the maintenance artifact from an authorized environment with database access. Use provider-managed provisioning where required, a durable external state store, and runtime secrets in the API service. Keep login redirects pinned to the configured Angular site.
4. For upgrades, lock the deployment, verify a restorable backup, confirm the expected migration history, and apply reviewed migrations and new required seed entries. Use additive changes for releases that need API and schema overlap. Gate traffic during incompatible changes.
5. Promote the release after runtime readiness passes. Record the outcome and retain the prior application artifact. Confirm schema compatibility before rolling the application back. Use a reviewed forward fix or a restore plan for incompatible schema changes.

## Acceptance criteria

- VPS and hosted deployments use the same provider-specific migration artifacts.
- A failed migration prevents release promotion and retains a diagnosable operation record.
- Routine upgrades never run first-admin bootstrap or sample-data seeding.
- The web service continues to run without provisioning or migration credentials.

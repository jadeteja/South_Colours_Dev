# Phase 3 · Installer and first administrator

**Dependencies:** [Phase 1](01-readiness.md) and [Phase 2](02-migrations.md).

## Components

- `backend/Southcolours.Installation/` owns the CLI, private wizard, provider probes, provisioning, progress, and audit. Use a loopback listener over SSH on the VPS or a trusted operations environment for hosted deployments.
- External deployment state stores installation ID, approved target, operation ID, checkpoints, and audit history. Keep it durable across database loss. Store secret references only.
- The database stores the matching installation ID, bootstrap completion, seed ledger, and EF migration history.

## Implementation

1. Authenticate an operator through the operations environment. Protect browser sessions with short-lived launch credentials, secure cookies, CSRF checks, and rate limits. Restrict the connection tester to approved destinations.
2. Acquire a deployment-wide lock before connecting to the target. Record the operation and classified probe result. Start fresh only for a trusted new deployment. Resume only a matching interrupted operation. Send ambiguous or unexpected targets to review.
3. Validate the provider, server identity, target database, and TLS. For a confirmed absent target, use a short-lived provisioning identity where supported. Otherwise attach a provider-provisioned database with a verified empty application scope. Recheck ownership after an interrupted create before resuming.
4. Apply provider migrations with the migration identity. Use the runtime identity for final verification. Keep elevated credentials out of API configuration, command-line arguments, and logs.
5. Extract the four existing Identity roles from `DatabaseSeeder` into a versioned production seed. Write each required seed and its immutable ledger entry transactionally with stable keys. Keep sample products, coupons, and banners in opt-in development seeding.
6. Create an operator-selected `SuperAdmin` through `UserManager` and `RoleManager`. Check every Identity result. Commit the account, role membership, and bootstrap completion together. Review existing email conflicts before granting roles. Existing deployments use a separate adoption operation and keep their administrators.
7. Verify the installed schema and installation ID using runtime credentials. Finalize external state idempotently, revoke elevated access, terminate the setup session and listener, and redirect to the configured frontend's `/auth/login`.

## Acceptance criteria

- Parallel setup requests result in a single installation operation.
- Interruptions after provisioning, migrations, seed commit, or database completion can resume safely. Uncertain ownership stops for review.
- Retrying does not duplicate seeds or administrators. An existing account never gains a role solely because its email matches.
- Setup stays closed after completion, including when the installed database becomes unavailable.

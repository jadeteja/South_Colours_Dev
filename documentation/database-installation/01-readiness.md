# Phase 1 · Deployment inventory and readiness

## Implementation

1. Inventory each deployment's actual provider, approved host or project, database name, runtime identity, last migration, and provisioning owner. Inspect production schemas using a read-only account or restored backup. The VPS deployment guide and Render blueprint are starting points.
2. In `backend/Southcolours.API/Program.cs`, make provider selection explicit. Preserve the `ConnectionStrings__DefaultConnection` deployment key. Parse with provider connection builders, require certificate-validated TLS in production, and return sanitized configuration errors.
3. Remove the public `GET /api/seed` route and the production startup migration and seed block. Remove hard-coded administrator and JWT signing defaults, check prior exposure, and rotate affected deployed credentials. Review server-side role authorization on admin controllers and constrain CORS to deployed frontend origins.
4. Split liveness from readiness. Use bounded database checks and report generic readiness failures. Gate database-dependent routes with HTTP 503 when required checks fail. Keep the diagnostic category in restricted logs. Until Phase 3 lands, verify existing deployments with the inventoried schema and introduce installation-ID enforcement alongside the adoption rollout.
5. Keep the current deployment on its known compatible schema during this transition. Coordinate removal of startup mutations with the release procedure for databases that still depend on them.

## Acceptance criteria

- The API starts without attempting database creation, migration, seeding, or administrator creation.
- Missing configuration, invalid credentials, TLS failure, and unavailable database produce failed readiness with sanitized diagnostics.
- An existing compatible deployment still serves traffic. An unauthenticated caller cannot trigger bootstrap or privileged API writes.

# Automatic database installation

Implement in order. This plan covers one database per deployment, shared by ASP.NET Core Identity and commerce through `ApplicationDbContext`. The public API observes readiness. A private operator tool performs installation, upgrade, and recovery.

| Phase | Deliverable |
| --- | --- |
| [1. Deployment inventory and readiness](01-readiness.md) | Verified targets, safe API startup, and a rollout plan |
| [2. Provider migrations and legacy adoption](02-migrations.md) | Independent SQL Server and PostgreSQL migration streams |
| [3. Installer and first administrator](03-installer.md) | Authorized, resumable installation with audit history |
| [4. Deployment and upgrades](04-deployment.md) | VPS and Render integration with release gates |
| [5. Recovery and release verification](05-recovery.md) | Incident triage and a rehearsed restore procedure |

The runtime needs a compatible schema and matching installation ID before serving database-dependent traffic. First-time setup requires a trusted deployment record explicitly marked new. An existing database with an unknown schema or installation ID requires operator review. A failed connection keeps setup closed.

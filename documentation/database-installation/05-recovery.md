# Phase 5 · Recovery and release verification

**Dependency:** [Phase 4](04-deployment.md).

## Incident procedure

1. Keep setup closed and database-dependent traffic gated. Read the external deployment identity and expected target. Inspect configuration, network, TLS, credentials, permissions, and server health.
2. On PostgreSQL, treat SQLSTATE `3D000` as a signal to verify catalog absence on the expected cluster using a trusted maintenance connection. On SQL Server, check catalog inventory with sufficient visibility and rule out offline status and access failures. If server identity or inventory is uncertain, keep the incident unresolved. Use server or provider audit records to establish deletion when available.
3. For confirmed absence, obtain operator approval and restore the selected backup to a separate target. Record the recovery point and backup ID. Verify the installation ID, migration history, data integrity, and runtime privileges before switching the runtime secret reference.
4. Restore uploads and `store_settings.json` from their corresponding backups as needed. Reconcile orders and payment events since the recovery point before reopening checkout. Verify readiness and record cutover.
5. When no usable backup exists, require explicit data-loss approval for a replacement installation with a new installation ID and retained incident history.

## Release verification

| Scenario | Expected outcome |
| --- | --- |
| DNS, TLS, credentials, or permissions fail | Readiness fails, setup stays closed, and no create operation runs |
| Expected catalog exists but is offline | Availability incident, with existing data preserved |
| Previously installed catalog is confirmed absent | Recovery only, with no automatic replacement |
| Catalog exists with an unexpected installation ID | Operator review before any write |
| External deployment record is missing | Operator review before any setup or recovery operation |
| Restore or cutover verification fails | Traffic stays gated and the original target is preserved |
| Restore succeeds | Runtime identity passes readiness and audit records identify the recovered target |

Rehearse the restore using isolated staging infrastructure before enabling production installation. Include a restart and interrupted operation in the rehearsal.

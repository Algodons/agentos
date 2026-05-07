# Disaster Recovery Plan

## Objectives

- **RTO**: 30 minutes for core API restoration.
- **RPO**: 15 minutes for persistent operational metadata.

## Recovery Phases

1. **Detect and declare incident**
   - Trigger incident commander role.
   - Freeze releases and non-essential deployments.
2. **Stabilize**
   - Shift traffic to healthy region/environment.
   - Roll back to last known-good release tag.
3. **Restore**
   - Rehydrate state/configuration from backups and IaC definitions.
   - Re-run smoke checks and determinism tests.
4. **Validate and communicate**
   - Confirm SLO recovery.
   - Communicate status to stakeholders.

## Backup and Restore Requirements

- Daily encrypted backups of deployment configuration and secrets metadata references.
- Immutable release artifacts retained for at least 90 days.
- Quarterly restoration drills with documented outcomes.

## Human Approval Checkpoint

Incident commander and security lead must jointly approve return to normal release operations.

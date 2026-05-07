# Vercel Deployment Playbook

## Project Setup

1. Import repository into Vercel.
2. Set framework preset to Next.js.
3. Configure production environment variables using Vercel encrypted secrets.

## Release Strategy

- Deploy preview for every PR.
- Promote to production only from protected `main` branch.
- Pin deployment to release tags for auditable rollouts.

## Human Approval Checkpoint

- Require reviewer approval on PR.
- Require workflow `CI` and `Security` to pass before merge.
- Require explicit production promotion by release manager.

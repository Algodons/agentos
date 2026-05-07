# Docker Deployment Playbook

## Build

```bash
docker build -t ghcr.io/algodons/agentos:<tag> .
```

## Run

```bash
docker run --rm -p 3000:3000 --env-file .env.local ghcr.io/algodons/agentos:<tag>
```

## Security Hardening Controls

- Use immutable tags (`vX.Y.Z` + commit SHA) and never deploy `latest` to production.
- Run containers with read-only filesystems and non-root users in orchestration layers.
- Inject secrets through runtime secret stores; never bake into images.
- Validate image digests against release checksum artifacts before rollout.

## Human Approval Checkpoint

Before production rollout, release manager must verify:

1. CI workflow green on release tag.
2. Security workflow green (CodeQL + dependency audit).
3. Signed-off deployment ticket with rollback owner assigned.

# Scaling Playbook

## Horizontal Scaling Strategy

- Scale web tier via Kubernetes HPA between 3 and 15 replicas.
- Keep worker pool concurrency tied to available vCPU: `concurrency = vCPU * 2`.
- Limit queue growth with explicit `maxQueueSize` guardrails.

## Capacity Planning

- Baseline with load tests at 1x, 2x, and 4x expected peak RPS.
- Reserve 30% headroom above 95th percentile peak.
- Validate release candidate under peak load before production promotion.

## Failure Containment

- Use bounded retries with exponential backoff.
- Fail fast on queue saturation and shed excess load.
- Keep deployments canary-first before global rollout.

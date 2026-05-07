# Kubernetes Deployment Playbook

## Apply Base Manifests

```bash
kubectl apply -f deploy/k8s/base/namespace.yaml
kubectl apply -f deploy/k8s/base/deployment.yaml
kubectl apply -f deploy/k8s/base/service.yaml
kubectl apply -f deploy/k8s/base/hpa.yaml
```

## Production Controls

- Keep `replicas >= 3` for zone-level resilience.
- Use HPA CPU target at 65% and max replicas of 15 by default.
- Require readiness and liveness probes on `/api/status`.
- Enforce Pod Security (`runAsNonRoot`, dropped capabilities, `RuntimeDefault` seccomp).

## Human Approval Checkpoint

Deployment to production namespace requires:

1. Approved change request.
2. On-call SRE acknowledgement.
3. Verified rollback image digest staged and tested.

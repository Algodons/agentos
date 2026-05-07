# Monitoring Dashboards and Alerting Rules

## Golden Signals Dashboard

Track these panels at 1m, 5m, and 1h windows:

- Request rate (`/api/optimize`, `/api/status`)
- Error rate (5xx responses)
- P95/P99 latency per endpoint
- Container CPU and memory
- Worker queue depth and saturation
- Deployment and release version distribution

## Recommended Alerts

### Critical
- API availability below 99.5% over 5 minutes.
- P99 latency above 3 seconds over 10 minutes.
- Error rate above 2% over 5 minutes.

### High
- Pod restart count > 3 within 10 minutes.
- HPA at max replicas for > 15 minutes.
- Security workflow failure on default branch.

### Medium
- CI failure rate > 20% on default branch over 24 hours.
- Dependency audit reports high/critical vulnerabilities.

## On-call Response Expectations

- Acknowledge critical alerts within 5 minutes.
- Begin mitigation within 10 minutes.
- Publish incident timeline and root-cause analysis within 24 hours.

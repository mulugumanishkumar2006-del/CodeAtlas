# CodeAtlas Observability & Telemetry Specification

- **Metrics**: Prometheus metrics (`/metrics`) tracking API latency, active jobs, worker queue depth, and AI token costs.
- **Health Probes**: `/health`, `/readiness`, `/liveness`.
- **SLOs**: 99.99% API availability, P95 API latency < 50ms, 100% analysis completion rate.

# Risk Concentration & Single Points of Failure

## 1. Classification Ranks

- `TECHNICAL_SINGLE_POINT`: High dependency fan-in where 20+ microservices depend on a single provider without fallback.
- `OWNERSHIP_SIGNAL`: High commit churn concentrated in a single team or engineer.
- `UNKNOWN`: Insufficient evidence to declare operational failure.

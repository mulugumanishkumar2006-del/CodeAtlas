# CodeAtlas API Platform Specification

## API Contract & Standards

- Endpoint Prefix: `/api/v1`
- OpenAPI Specification: `/docs` and `/redoc`
- Rate Limiting: 1,000 requests / min per organization (configurable per subscription tier).
- Standardized Error Envelope: `error_id`, `what_happened`, `why`, `impact`, `recommended_action`.

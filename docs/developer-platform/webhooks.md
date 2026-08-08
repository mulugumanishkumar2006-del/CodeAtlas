# CodeAtlas Webhooks Platform Specification

## Security & Reliability

- HMAC SHA-256 signatures (`X-CodeAtlas-Signature`).
- Anti-replay cryptographic nonces (`X-CodeAtlas-Nonce`) and timestamps.
- Exponential backoff retries (up to 5 attempts) with dead-letter queue (DLQ) inspection.

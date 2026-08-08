# CodeAtlas v2.0 Platform — Security Specification

## Production Security Posture

1. **Tenant Isolation**: Mandatory `organization_id` context scope injected into every SQL query, graph traversal, and AI search vector query.
2. **Secret Management**: Zero hardcoded credentials in git or frontend code; secrets fetched dynamically via KMS / HashiCorp Vault.
3. **Webhook Security**: Inbound webhooks validated with HMAC-SHA256 signatures, cryptographic nonces, and timestamp expiry.
4. **Data Protection**: TLS 1.3 in transit and AES-256 at rest.

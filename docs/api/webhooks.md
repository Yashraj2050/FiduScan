# Webhooks Guide

Webhooks allow FiduScan to notify your system asynchronously when background processing (like large video deepfake detection or blockchain anchoring) completes.

## Supported Events

- `detection.completed`: Fired when a media detection scan is finished.
- `watermark.extracted`: Fired when a watermark extraction task finishes.
- `evidence.anchored`: Fired when an evidence item is successfully anchored to the blockchain.
- `report.ready`: Fired when an asynchronous report PDF generation is complete.

## Security & Verification

To prevent spoofing, every webhook request sent by FiduScan includes a cryptographic signature in the `FiduScan-Signature` header.

You MUST verify this signature using your Webhook Secret before processing the payload.

### Python Verification Example

```python
import hmac
import hashlib

def verify_signature(payload_body: bytes, signature_header: str, secret: str) -> bool:
    expected_mac = hmac.new(
        secret.encode(), 
        payload_body, 
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_mac, signature_header)
```

### Node.js Verification Example

```javascript
const crypto = require('crypto');

function verifySignature(payloadBody, signatureHeader, secret) {
  const expectedMac = crypto
    .createHmac('sha256', secret)
    .update(payloadBody)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(expectedMac),
    Buffer.from(signatureHeader)
  );
}
```

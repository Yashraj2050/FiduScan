# FiduScan API Documentation

Welcome to the FiduScan REST API. This documentation covers all endpoints necessary to integrate enterprise-grade AI forensic detection directly into your trust & safety workflows.

---

## 1. Authentication
FiduScan uses API keys to authenticate requests. You can view and manage your API keys in the **Developer Portal**.

All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests must include your API key in the `Authorization` HTTP header.

```http
Authorization: Bearer YOUR_API_KEY
```

---

## 2. Image Detection Endpoint
Detects AI-generated images and extracts forensic metadata.

**Endpoint:** `POST /api/v1/detect`
**Content-Type:** `multipart/form-data`

### Request
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | `file` | Yes | Supported formats: JPEG, PNG, WEBP, BMP (Max: 20MB) |

### Response
```json
{
  "request_id": "uuid-v4",
  "filename": "image.jpg",
  "prediction": "AI_GENERATED",
  "confidence": 0.98,
  "ai_probability": 0.98,
  "authentic_probability": 0.02,
  "metadata": {},
  "heatmap_available": true,
  "heatmap_b64": "data:image/png;base64,...",
  "inference_time_ms": 145.2,
  "model_version": "v1.0"
}
```

### Error Codes
- `400 Bad Request`: Invalid file format or file size too large.
- `402 Payment Required`: Usage limit exceeded for current billing cycle.
- `429 Too Many Requests`: Rate limit exceeded.

---

## 3. Audio Detection Endpoint
Detects synthetic vocoder artifacts in audio files.

**Endpoint:** `POST /api/v1/audio/detect`
**Content-Type:** `multipart/form-data`

### Request
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | `file` | Yes | Supported formats: WAV, MP3, M4A, MPEG (Max: 20MB) |

### Response
```json
{
  "request_id": "uuid-v4",
  "filename": "voice.wav",
  "prediction": "AUTHENTIC",
  "confidence": 0.95,
  "ai_probability": 0.05,
  "authentic_probability": 0.95,
  "explanation_metadata": {},
  "inference_time_ms": 230.1,
  "model_version": "v1.0"
}
```

---

## 4. Video Detection Endpoint
Aggregates temporal, audio, and visual data to detect deepfakes.

**Endpoint:** `POST /api/v1/video/detect`
**Content-Type:** `multipart/form-data`

### Request
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | `file` | Yes | Supported formats: MP4, MOV, AVI, MKV (Max: 50MB) |

### Response
```json
{
  "request_id": "uuid-v4",
  "filename": "clip.mp4",
  "prediction": "AI_GENERATED",
  "confidence": 0.89,
  "video_score": 0.89,
  "frame_score": 0.92,
  "audio_score": 0.40,
  "metadata_score": 0.10,
  "temporal_score": 0.85,
  "explanation": "High frame-level inconsistencies detected.",
  "inference_time_ms": 1250.4,
  "model_version": "v1.0"
}
```

---

## 5. Scan History Endpoint
Retrieves your persistent scan logs.

**Endpoint:** `GET /api/v1/history`

### Request
*(No body required. Query parameters supported: `modality`, `result`, `page`)*

### Response
```json
{
  "total": 142,
  "scans": [
    {
      "scan_id": "uuid",
      "modality": "IMAGE",
      "filename": "test.jpg",
      "prediction": "AUTHENTIC",
      "confidence": "0.9912",
      "created_at": "2026-06-02T12:00:00Z"
    }
  ]
}
```

---

## 6. Billing Endpoints
**Endpoint:** `GET /api/v1/billing/subscription`
Retrieves the active Stripe subscription status.

### Response
```json
{
  "status": "active",
  "plan": "pro",
  "current_period_end": "2026-07-02T12:00:00Z"
}
```

---

## 7. Usage Endpoints
**Endpoint:** `GET /api/v1/billing/usage`
Retrieves live usage data and limits.

### Response
```json
{
  "current_plan": "pro",
  "usage_limits": {
    "image": 10000,
    "audio": 1000,
    "video": 500,
    "api_calls": 10000
  },
  "remaining_quota": {
    "image": 8500,
    "audio": 950,
    "video": 480,
    "api_calls": 8000
  },
  "storage_used": 10485760
}
```

---

## 8. Rate Limits
To ensure API stability, we enforce rate limiting across all endpoints based on your subscription tier:
- **Free:** 10 requests / minute
- **Pro:** 100 requests / minute
- **Enterprise:** 1000 requests / minute

*Exceeding these limits will result in a `429 Too Many Requests` error.*

---

## 9. Error Reference
| Code | Reason | Resolution |
|------|--------|------------|
| `400` | Bad Request | Check the formatting of your request body/file. |
| `401` | Unauthorized | API key is missing or invalid. |
| `402` | Payment Required | Monthly quota reached. Upgrade your plan. |
| `403` | Forbidden | Your API key was revoked or lacks permissions. |
| `429` | Too Many Requests | You hit the rate limit. Back off and retry. |
| `500` | Internal Server Error | FiduScan inference engine failure. |

---

## 10. Example cURL Requests

**Image Detection**
```bash
curl -X POST https://api.fiduscan.com/api/v1/detect \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@/path/to/image.jpg"
```

**Get Usage**
```bash
curl -X GET https://api.fiduscan.com/api/v1/billing/usage \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 11. Example JavaScript Requests

**Image Detection (Node.js/Fetch)**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('https://api.fiduscan.com/api/v1/detect', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const data = await response.json();
console.log(data);
```

---

## 12. Security Best Practices
- **Do not embed API keys directly in frontend code.** Route calls through your backend server.
- **Rotate keys regularly.** If you suspect a key is compromised, revoke it immediately via the Developer Portal.
- **Enforce TLS/HTTPS.** Never send API keys over unencrypted networks.

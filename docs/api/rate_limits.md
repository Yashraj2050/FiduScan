# Rate Limits and Quotas

FiduScan uses token bucket rate limiting to ensure platform stability. 

## Limits by Tier

| Tier       | API Requests | Deepfake Detections | Watermark Extractions |
|------------|--------------|---------------------|-----------------------|
| **Free**   | 60 / min     | 100 / month         | 50 / month            |
| **Pro**    | 300 / min    | 5,000 / month       | 5,000 / month         |
| **Enterprise**| Custom  | Custom              | Custom                |

## Rate Limit Headers

Every API response includes headers detailing your current rate limit status:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the current time window.
- `X-RateLimit-Remaining`: The number of requests remaining in the current window.
- `X-RateLimit-Reset`: The Unix timestamp when the limit will reset.

## Handling HTTP 429 Too Many Requests

If you exceed your rate limit, the API will respond with `HTTP 429 Too Many Requests`. The response will include a `Retry-After` header indicating how many seconds to wait before retrying.

We strongly recommend implementing exponential backoff with jitter in your SDKs or clients.

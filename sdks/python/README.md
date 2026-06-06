
# FiduScan Python SDK

Official Python SDK for integrating the FiduScan Digital Authenticity & Evidence Platform.

## Installation

```bash
pip install fiduscan
```

## Quick Start

```python
from fiduscan import FiduScan

# Initialize with API Key
sdk = FiduScan(api_key="your_api_key")

# 1. Detect Deepfake
result = sdk.detection.detect_image("path/to/image.jpg")
print(result)

# 2. Embed Watermark
watermark = sdk.watermark.embed_watermark("path/to/media.mp4", "payload_data")

# 3. Create Case
case = sdk.cases.create_case(title="Investigation A", description="Details here")
```

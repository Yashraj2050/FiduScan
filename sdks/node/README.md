
# @fiduscan/sdk

Official Node.js / TypeScript SDK for integrating the FiduScan Digital Authenticity & Evidence Platform.

## Installation

```bash
npm install @fiduscan/sdk
```

## TypeScript Example

```typescript
import { FiduScan } from "@fiduscan/sdk";
import fs from "fs";

const sdk = new FiduScan({ apiKey: "your_api_key" });

async function main() {
  const file = fs.readFileSync("path/to/image.jpg");
  const result = await sdk.detection.detectImage(file);
  console.log(result);
}

main();
```

## Next.js API Route Example

```typescript
import { FiduScan } from "@fiduscan/sdk";

const sdk = new FiduScan({ apiKey: process.env.FIDUSCAN_API_KEY });

export async function POST(request: Request) {
  const caseData = await sdk.cases.createCase("Title", "Desc");
  return Response.json(caseData);
}
```

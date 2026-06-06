
import { Client } from "../client";

export class WatermarkClient {
  constructor(private client: Client) {}

  async embedWatermark(file: Buffer | Blob, payload: string) {
    return this.client.request("POST", "/watermark/embed", { file, payload }, true);
  }

  async verifyWatermark(file: Buffer | Blob) {
    return this.client.request("POST", "/watermark/verify", { file }, true);
  }
}

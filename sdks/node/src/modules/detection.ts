
import { Client } from "../client";

export class DetectionClient {
  constructor(private client: Client) {}

  async detectImage(file: Buffer | Blob, filename: string = "image.jpg") {
    // In real implementation, this would use FormData
    return this.client.request("POST", "/detect/image", { file }, true);
  }

  async detectAudio(file: Buffer | Blob, filename: string = "audio.wav") {
    return this.client.request("POST", "/detect/audio", { file }, true);
  }

  async detectVideo(file: Buffer | Blob, filename: string = "video.mp4") {
    return this.client.request("POST", "/detect/video", { file }, true);
  }
}

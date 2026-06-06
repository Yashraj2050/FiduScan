
import { Client } from "../client";

export class EvidenceClient {
  constructor(private client: Client) {}

  async createEvidence(metadata: any) {
    return this.client.request("POST", "/evidence", metadata);
  }

  async verifyEvidence(evidenceId: string) {
    return this.client.request("GET", `/evidence/${evidenceId}/verify`);
  }
}

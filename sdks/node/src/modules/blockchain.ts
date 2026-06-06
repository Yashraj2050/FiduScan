
import { Client } from "../client";

export class BlockchainClient {
  constructor(private client: Client) {}

  async createAnchor(evidenceId: string) {
    return this.client.request("POST", "/blockchain/anchor", { evidence_id: evidenceId });
  }

  async verifyAnchor(anchorId: string) {
    return this.client.request("GET", `/blockchain/anchor/${anchorId}/verify`);
  }
}

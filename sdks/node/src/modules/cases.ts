
import { Client } from "../client";

export class CasesClient {
  constructor(private client: Client) {}

  async createCase(title: string, description: string) {
    return this.client.request("POST", "/cases", { title, description });
  }

  async updateCase(caseId: string, updates: any) {
    return this.client.request("PUT", `/cases/${caseId}`, updates);
  }
}

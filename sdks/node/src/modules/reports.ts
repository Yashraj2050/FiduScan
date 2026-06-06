
import { Client } from "../client";

export class ReportsClient {
  constructor(private client: Client) {}

  async generateReport(caseId: string, format: string = "pdf") {
    return this.client.request("POST", "/reports/generate", { case_id: caseId, format });
  }
}

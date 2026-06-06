
import { Client, ClientConfig } from "./client";
import { DetectionClient } from "./modules/detection";
import { WatermarkClient } from "./modules/watermark";
import { EvidenceClient } from "./modules/evidence";
import { BlockchainClient } from "./modules/blockchain";
import { CasesClient } from "./modules/cases";
import { ReportsClient } from "./modules/reports";

export * from "./errors";
export * from "./client";

export class FiduScan {
  public detection: DetectionClient;
  public watermark: WatermarkClient;
  public evidence: EvidenceClient;
  public blockchain: BlockchainClient;
  public cases: CasesClient;
  public reports: ReportsClient;

  constructor(config: ClientConfig) {
    const client = new Client(config);
    this.detection = new DetectionClient(client);
    this.watermark = new WatermarkClient(client);
    this.evidence = new EvidenceClient(client);
    this.blockchain = new BlockchainClient(client);
    this.cases = new CasesClient(client);
    this.reports = new ReportsClient(client);
  }
}

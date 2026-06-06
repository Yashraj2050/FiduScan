
from .client import Client
from .detection import DetectionClient
from .watermark import WatermarkClient
from .evidence import EvidenceClient
from .blockchain import BlockchainClient
from .cases import CasesClient
from .reports import ReportsClient

class FiduScan:
    def __init__(self, api_key=None, bearer_token=None, base_url="https://api.fiduscan.io/v1"):
        self.client = Client(api_key=api_key, bearer_token=bearer_token, base_url=base_url)
        self.detection = DetectionClient(self.client)
        self.watermark = WatermarkClient(self.client)
        self.evidence = EvidenceClient(self.client)
        self.blockchain = BlockchainClient(self.client)
        self.cases = CasesClient(self.client)
        self.reports = ReportsClient(self.client)

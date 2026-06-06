
class ReportsClient:
    def __init__(self, client):
        self.client = client

    def generate_report(self, case_id, format="pdf"):
        return self.client.request("POST", "/reports/generate", json={"case_id": case_id, "format": format})

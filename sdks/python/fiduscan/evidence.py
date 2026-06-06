
class EvidenceClient:
    def __init__(self, client):
        self.client = client

    def create_evidence(self, metadata):
        return self.client.request("POST", "/evidence", json=metadata)

    def verify_evidence(self, evidence_id):
        return self.client.request("GET", f"/evidence/{evidence_id}/verify")

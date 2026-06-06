
class BlockchainClient:
    def __init__(self, client):
        self.client = client

    def create_anchor(self, evidence_id):
        return self.client.request("POST", "/blockchain/anchor", json={"evidence_id": evidence_id})

    def verify_anchor(self, anchor_id):
        return self.client.request("GET", f"/blockchain/anchor/{anchor_id}/verify")


class CasesClient:
    def __init__(self, client):
        self.client = client

    def create_case(self, title, description):
        return self.client.request("POST", "/cases", json={"title": title, "description": description})

    def update_case(self, case_id, updates):
        return self.client.request("PUT", f"/cases/{case_id}", json=updates)

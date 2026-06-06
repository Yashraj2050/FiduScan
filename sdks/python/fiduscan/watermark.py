
class WatermarkClient:
    def __init__(self, client):
        self.client = client

    def embed_watermark(self, file_path, payload):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/watermark/embed", files={"file": f}, data={"payload": payload})

    def verify_watermark(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/watermark/verify", files={"file": f})

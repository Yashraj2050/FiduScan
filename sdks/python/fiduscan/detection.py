
class DetectionClient:
    def __init__(self, client):
        self.client = client

    def detect_image(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/detect/image", files={"file": f})

    def detect_audio(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/detect/audio", files={"file": f})

    def detect_video(self, file_path):
        with open(file_path, "rb") as f:
            return self.client.request("POST", "/detect/video", files={"file": f})

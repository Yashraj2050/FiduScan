
import boto3
import os
import magic # mime validation

class StorageService:
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=os.environ.get("R2_ENDPOINT_URL"),
            aws_access_key_id=os.environ.get("R2_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("R2_SECRET_ACCESS_KEY")
        )
        self.bucket = os.environ.get("R2_BUCKET_NAME", "fiduscan-prod")

    def upload_file(self, file_path, object_name):
        # 1. Size Validation
        size = os.path.getsize(file_path)
        if size > 500 * 1024 * 1024:
            raise ValueError("File exceeds 500MB limit.")
            
        # 2. MIME Validation
        mime = magic.from_file(file_path, mime=True)
        allowed = ["image/jpeg", "image/png", "video/mp4", "audio/wav", "application/pdf"]
        if mime not in allowed:
            raise ValueError("Unsupported MIME type.")
            
        # 3. Upload
        self.client.upload_file(file_path, self.bucket, object_name, ExtraArgs={"ContentType": mime})
        return object_name

    def generate_presigned_url(self, object_name, expiration=3600):
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": object_name},
            ExpiresIn=expiration
        )

    def delete_file(self, object_name):
        self.client.delete_object(Bucket=self.bucket, Key=object_name)

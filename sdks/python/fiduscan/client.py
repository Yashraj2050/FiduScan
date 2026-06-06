
import requests
from .errors import APIError, AuthenticationError, ValidationError, RateLimitError

class Client:
    def __init__(self, api_key=None, bearer_token=None, base_url="https://api.fiduscan.io/v1"):
        self.base_url = base_url
        self.headers = {"Content-Type": "application/json"}
        if api_key:
            self.headers["X-API-Key"] = api_key
        elif bearer_token:
            self.headers["Authorization"] = f"Bearer {bearer_token}"
        else:
            raise ValueError("Must provide api_key or bearer_token")

    def request(self, method, path, **kwargs):
        url = f"{self.base_url}{path}"
        response = requests.request(method, url, headers=self.headers, **kwargs)
        if response.status_code >= 400:
            self._handle_error(response)
        return response.json()

    def _handle_error(self, response):
        status = response.status_code
        try:
            payload = response.json()
            message = payload.get("detail", response.text)
        except Exception:
            payload = None
            message = response.text

        if status in (401, 403):
            raise AuthenticationError(message, status, payload)
        elif status == 422:
            raise ValidationError(message, status, payload)
        elif status == 429:
            raise RateLimitError(message, status, payload)
        else:
            raise APIError(message, status, payload)


class FiduScanError(Exception):
    pass

class APIError(FiduScanError):
    def __init__(self, message, status_code=None, payload=None):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload

class AuthenticationError(APIError):
    pass

class ValidationError(APIError):
    pass

class RateLimitError(APIError):
    pass

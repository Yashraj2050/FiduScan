
import unittest
from unittest.mock import patch, MagicMock
from fiduscan import FiduScan
from fiduscan.errors import AuthenticationError, RateLimitError

class TestFiduScanSDK(unittest.TestCase):
    def setUp(self):
        self.sdk = FiduScan(api_key="test_key")

    @patch("fiduscan.client.requests.request")
    def test_detect_image(self, mock_req):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"fake_probability": 0.99}
        mock_req.return_value = mock_resp
        
        with patch("builtins.open", unittest.mock.mock_open(read_data=b"data")):
            res = self.sdk.detection.detect_image("test.jpg")
            
        self.assertEqual(res["fake_probability"], 0.99)
        mock_req.assert_called_once()

    @patch("fiduscan.client.requests.request")
    def test_auth_error(self, mock_req):
        mock_resp = MagicMock()
        mock_resp.status_code = 401
        mock_resp.json.return_value = {"detail": "Invalid key"}
        mock_req.return_value = mock_resp
        
        with self.assertRaises(AuthenticationError):
            self.sdk.cases.create_case("T", "D")

    @patch("fiduscan.client.requests.request")
    def test_rate_limit(self, mock_req):
        mock_resp = MagicMock()
        mock_resp.status_code = 429
        mock_resp.json.return_value = {"detail": "Too many"}
        mock_req.return_value = mock_resp
        
        with self.assertRaises(RateLimitError):
            self.sdk.blockchain.create_anchor("ev_123")

if __name__ == "__main__":
    unittest.main()


import os
import logging
from web3 import Web3
from web3.middleware import geth_poa_middleware

POLYGON_RPC_URL = os.environ.get("POLYGON_RPC_URL")
PRIVATE_KEY = os.environ.get("POLYGON_PRIVATE_KEY")

class BlockchainService:
    @staticmethod
    def _get_web3():
        if not POLYGON_RPC_URL or not PRIVATE_KEY:
            raise RuntimeError("Polygon RPC URL and Private Key are required for production.")
        w3 = Web3(Web3.HTTPProvider(POLYGON_RPC_URL))
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        return w3

    @classmethod
    def anchor_evidence(cls, evidence_hash: str, report_hash: str):
        w3 = cls._get_web3()
        account = w3.eth.account.from_key(PRIVATE_KEY)
        
        # Simplified: storing hash in a null transaction payload or a contract call
        # Here we just put it in the transaction data for demonstration
        data = f"{evidence_hash}:{report_hash}".encode("utf-8")
        
        tx = {
            "to": account.address, # Sending to self as an anchor
            "value": 0,
            "gas": 100000,
            "gasPrice": w3.eth.gas_price,
            "nonce": w3.eth.get_transaction_count(account.address),
            "data": data,
            "chainId": 137 # Polygon Mainnet
        }
        
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            "tx_hash": tx_hash.hex(),
            "block_number": receipt.blockNumber,
            "explorer_url": f"https://polygonscan.com/tx/{tx_hash.hex()}"
        }

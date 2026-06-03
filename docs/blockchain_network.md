# Blockchain Network Selection for FiduScan

## Overview
This document evaluates the options for anchoring evidence hashes onto a public blockchain to ensure immutable provenance.

## Candidate Networks

1. **Polygon (PoS)**
   - **Pros:** Extremely low transaction fees, high throughput, EVM compatibility, mature ecosystem.
   - **Cons:** Slightly less decentralized than Ethereum mainnet.
   
2. **Base (Coinbase L2)**
   - **Pros:** Backed by Coinbase, strong security inherited from Ethereum, growing developer adoption.
   - **Cons:** Newer network, relies on a centralized sequencer.
   
3. **Ethereum L2 (Optimism / Arbitrum)**
   - **Pros:** Excellent security guarantees (optimistic rollups), high liquidity.
   - **Cons:** Fees can still occasionally spike during high mainnet congestion compared to sidechains like Polygon.

## Recommendation
We recommend **Polygon**. For a high-volume application like FiduScan where potentially thousands of reports and evidence chains need to be anchored daily, Polygon provides the best balance of cost efficiency, speed, and sufficient decentralization for cryptographic anchoring. 

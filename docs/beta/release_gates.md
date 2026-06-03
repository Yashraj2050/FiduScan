# Beta Release Gates

## 1. Beta Success Criteria
The beta is considered a success and ready to move towards General Availability (GA) if:
- 0 Critical severity bugs are discovered or all are patched.
- < 5 Major severity bugs remain open.
- Platform uptime exceeds 99.9% over the 14-day duration.
- Target telemetry is achieved (>150 investigations completed globally).

## 2. Beta Failure Criteria
The beta must be paused and extended if:
- Evidence Chain corruption occurs (e.g., mismatching hashes).
- User authentication boundaries are breached (cross-tenant data leakage).
- API timeouts exceed 5% of all requests.

## 3. General Availability (GA) Launch Criteria
- Beta Success Criteria met.
- All UX confusion points addressed via UI updates or tooltip documentation.
- Blockchain anchoring transitioned from Mock to Mainnet.

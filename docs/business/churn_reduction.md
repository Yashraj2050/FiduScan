# Churn Reduction Strategy

## Overview
Reducing gross MRR churn from 10% to < 3% by proactively addressing user friction and engagement drop-offs.

## 1. Predictive Churn Modeling
- Track the "Days Since Last Scan" metric. 
- If a Pro user has not run a scan in 14 days, trigger an automated lifecycle email highlighting a recent high-profile deepfake news story, demonstrating how FiduScan detects it.

## 2. In-App Interventions
- Implement a cancellation flow via Stripe billing portal.
- Before a user can cancel, offer a 1-click option to pause the subscription for 2 months instead.
- If they proceed to cancel, require a mandatory 1-question exit survey to categorize the churn reason (Price, Missing Feature, Not Useful, Buggy).

## 3. Customer Success (Enterprise)
- Assign a dedicated Account Manager to all Enterprise clients.
- Conduct mandatory Quarterly Business Reviews (QBRs) to demonstrate the ROI (number of fake assets blocked) FiduScan provided that quarter.

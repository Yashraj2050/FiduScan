# Beta Tester Onboarding Checklist

Welcome to the FiduScan Beta! To help us validate the system thoroughly, please try to complete the following steps during your 14-day testing window.

## Initial Setup
- [ ] Receive beta invitation email and click the activation link.
- [ ] Log in successfully to the FiduScan dashboard.
- [ ] Read the `beta_tester_guide.md` attached to your invitation.
- [ ] Join the `#fiduscan-beta-squad` Slack channel.

## Web UI Testing
- [ ] Upload an Image (JPEG/PNG) known to be authentic. Note the confidence score.
- [ ] Upload an Image known to be AI-generated (Midjourney/DALL-E). Verify the Grad-CAM heatmap overlay.
- [ ] Upload an Audio file (WAV/MP3). Verify the result card.
- [ ] Upload a Video file (MP4). Verify the temporal and frame-level breakdown.
- [ ] Navigate to the **History** tab and verify all 4 of the above scans were logged successfully.

## Developer & Billing Testing
- [ ] Navigate to **Settings > Developer Portal**.
- [ ] Generate a new API Key and copy it.
- [ ] Use cURL or Postman to successfully hit the `/api/v1/detect` endpoint using your new key.
- [ ] Navigate to **Settings > Billing**.
- [ ] Verify that your test quota has decremented based on your UI and API uploads.
- [ ] Attempt to trigger a "Limit Reached" error by exceeding your Free tier quota, OR use the Stripe Test Portal to "upgrade" to the Pro tier (using a Stripe Test Credit Card).

## Feedback Submission
- [ ] Report at least 1 piece of UX friction or minor bug via the Slack channel.
- [ ] Submit the mandatory Exit Survey (`user_survey.md`) before the beta window closes.

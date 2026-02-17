# Apple Rejection Fix Plan - Feb 16, 2026

## 1. Guideline 2.1 - App Completeness (Missing In-App Purchases)

**Issue:** You have IAP code in the app, but the actual IAP products were not selected for review in App Store Connect.

**Action Required (App Store Connect):**
1.  Go to **My Apps > Features > In-App Purchases**.
2.  Ensure your subscription product (e.g., `premium_monthly`) status is **"Ready to Submit"**.
3.  Go to the **App Review (Submission)** page.
4.  Scroll down to the **In-App Purchases** section.
5.  Click the **(+)** button and select your IAP product(s).
6.  **Upload a Screenshot:** In the same section, upload a screenshot of your Paywall (the screen where users buy the subscription) so the reviewer can see what they are buying.

---

## 2. Guideline 3.1.2 - Business - Metadata (Missing Links)

**Issue:** The App Store metadata is missing required links to your Terms of Use (EULA) and Privacy Policy.

**Action Required (App Store Connect):**
1.  **App Information > Privacy Policy URL:** Ensure this field contains:
    `https://nirvan-ai-coach.vercel.app/PRIVACY_POLICY.html`
2.  **App Description:** Add the following text at the end of your description:
    "Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"

---

## 3. Guideline 2.1 - Performance - Bug (Unresponsive Links)

**Issue:** The "Privacy Policy" and "Terms of Service" buttons in the App Settings were unresponsive on the reviewer's device.

**Fix Implemented (Code):**
-   Updated `app/settings.tsx` to use `WebBrowser.openBrowserAsync` instead of `Linking.openURL`.
-   Updated `components/consent-modal.tsx` to use `WebBrowser.openBrowserAsync`.
-   This provides a robust in-app browser experience that is less likely to fail silently.
-   Added error handling to alert the user if a link cannot be opened.
-   Incremented build number to `5` in `app.json`.

**Action Required (Build & Submit):**
1.  **Rebuild the app:** Run `eas build --platform ios` (or your preferred build command) to create a new binary with build number 5.
2.  **Upload to TestFlight/App Store Connect.**
3.  **Select this new build** for your submission.

---

## checklist

- [ ] IAP Products added to submission in ASC.
- [ ] Paywall Screenshot uploaded to IAP Review section in ASC.
- [ ] Privacy Policy URL verified in ASC App Information.
- [ ] Terms of Use link added to ASC App Description.
- [ ] New Build (v1.0.0 Build 5) created and uploaded.
- [ ] Reply to Apple in Resolution Center:
    > "We have uploaded a new binary (Build 5) that fixes the unresponsive links in the Settings menu. We have also attached the In-App Purchase products to the submission and updated the App Description with the Terms of Use link."

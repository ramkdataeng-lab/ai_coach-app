# RevenueCat Setup Guide for "Nirvan"

Follow these steps to configure RevenueCat specifically for this app (`com.ramkumar.gudivada.nirvanaicoachv2`).

## 1. Create a New RevenueCat Project
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/).
2. Click **Create New Project**.
3. Name it "Nirvan AI Coach" (or similar).

## 2. Add Your App (iOS)
1. In your new project, click **Add App** -> **App Store**.
2. **App Name**: Nirvan AI Coach
3. **App Bundle ID**: `com.ramkumar.gudivada.nirvanaicoachv2`
   * *Note: This MUST match the `ios.bundleIdentifier` in your `app.json` file.*
4. Click **Save Changes**.

## 3. Get Your API Key
1. Go to **Project Settings** (gear icon) -> **API Keys**.
2. Copy the **Public API Key** for iOS (starts with `appl_...`).
3. Open `utils/revenuecat.ts` in your code.
4. Paste this key into `API_KEYS.ios`.

## 4. Set Up Products & Entitlements
This is crucial for the paywall to work.

### Step A: Create Entitlement
1. Go to **Entitlements** in the sidebar.
2. Click **New**.
3. **Identifier**: `premium`
   * *Important: This must be exactly `premium` because that is what the code expects (see `utils/revenuecat.ts`).*
4. Description: "Pro Access".
5. Click **Add**.

### Step B: Create Offering
1. Go to **Offerings**.
2. Click **New**.
3. **Identifier**: `default`
   * *Important: RevenueCat SDK looks for the "current" offering, which defaults to this.*
4. Description: "Default Offering".
5. Click **Save**.

### Step C: Add a Package
1. Click on your new `default` offering to edit it.
2. Click **New Package**.
3. **Identifier**: `monthly` (or `$rc_monthly`).
4. Description: "Monthly Subscription".
5. **Attach Product**:
   * If you haven't created products yet, you'll need to click **Create New Product**.
   * **Identifier**: Use the Product ID from App Store Connect (e.g., `nirvan_pro_monthly`).
   * **Store**: App Store.
   * **Price**: Set a price (e.g., $9.99).
6. Once the product is created/attached, ensure it is linked to the `premium` entitlement.

## 5. Verify
1. Restart your Expo server (`npx expo start --clear`).
2. Run the app.
3. The error "RevenueCat SDK Configuration is not valid" should be gone.

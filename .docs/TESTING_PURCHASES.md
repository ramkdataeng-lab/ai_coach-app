# Testing In-App Purchases (IAP) - Complete Guide

## 🧪 Test Scenarios for Converting to Pro

---

## **Option 1: Debug Mode (Fastest - For Demo Video)**

### **Web Browser Testing**
1. Open app in browser: `npx expo start --web`
2. Navigate to **Profile** tab
3. **Tap "Profile" title 5 times**
4. Alert appears: "Pro Features Unlocked for Demo Video"
5. ✅ You're now Pro! Test unlimited messages

### **Expo Go Testing**
1. Run `npm start` and scan QR code on your phone
2. The app automatically enables Pro features in Expo Go
3. No need to manually unlock
4. Test all Pro features

**Best for**: 
- Recording demo videos
- Quick UI testing
- Showing clients the flow

---

## **Option 2: TestFlight Sandbox (Real Payment Flow)**

### **Prerequisites**
1. **App Store Connect Setup**:
   - Create In-App Purchase product
   - Product ID: `com.nirvan.pro.monthly` (example)
   - Type: Auto-Renewable Subscription
   - Price: $4.99/month (or your choice)
   - **Submit for review** or use in sandbox

2. **RevenueCat Dashboard Setup**:
   - Add product ID to RevenueCat
   - Create entitlement: `premium`
   - Link product to entitlement
   - Create offering (e.g., "default")
   - **Mark offering as current**

3. **Sandbox Tester Account**:
   - Go to App Store Connect → Users and Access → Sandbox Testers
   - Create test account: `test@yourdomain.com`
   - Use a fake email (doesn't need to exist)
   - Remember the password

### **Testing Steps**

#### **Step 1: Build for TestFlight**
```bash
.\build_ios.bat
```
Wait for EAS Build to complete (~15 min)

#### **Step 2: Install on Physical Device**
- Open TestFlight app on iPhone
- Download your build
- **Important**: Sign OUT of your real Apple ID in Settings → App Store
- Sign IN with sandbox tester account

#### **Step 3: Trigger the Paywall**
1. Open your app from TestFlight
2. Navigate to a coach chat
3. Send **26 messages** (exceeds 25 free limit)
4. Paywall appears automatically

**OR**

1. Go to Profile tab
2. Tap **"Upgrade to Pro"** button
3. Paywall appears

#### **Step 4: Make Sandbox Purchase**
1. Paywall shows your subscription options
2. Tap subscription plan (e.g., "Monthly $4.99")
3. Apple payment sheet appears
4. **Username**: Your sandbox tester email
5. **Password**: Sandbox tester password
6. Confirm purchase
7. ✅ You're now Pro!

#### **Step 5: Verify Pro Status**
- Go to Profile tab
- Should show "Pro Member"
- Try sending unlimited messages
- No more paywalls!

### **Important Notes**:
- Sandbox purchases are **FREE** (no real money charged)
- You can make unlimited test purchases
- Subscriptions renew every 5 minutes (instead of monthly)
- **Never use real Apple ID for sandbox testing**

---

## **Option 3: Simulator Testing (Limited)**

### **Issue**: iOS Simulator cannot make real purchases
- You'll see "Store Unavailable" errors
- Use for UI testing only, not payment flow

### **Workaround**:
```typescript
// In revenuecat.ts, temporarily add:
static async init() {
    if (__DEV__) {
        console.log('[RevenueCat] Dev mode - enabling mock Pro');
        this.mockPro = true;
        return;
    }
    // ... rest of init
}
```

Then run simulator and you'll be Pro automatically.

---

## **Option 4: Production Testing (Real Money)**

### **After App Store Approval**
1. Download from App Store (live version)
2. Use your **real Apple ID**
3. Make a real purchase (charges real money)
4. Test the full production flow

**To get refund**: 
- Go to https://reportaproblem.apple.com
- Request refund for test purchase

---

## 🎯 Recommended Testing Flow

### **For Your Demo Video (RIGHT NOW)**
1. Use **Option 1 (Debug Mode)**
2. Record video showing:
   - Create custom coach
   - Chat with AI
   - Hit free limit
   - Tap Profile 5x to unlock Pro
   - Show unlimited messages

### **For TestFlight Submission**
1. Use **Option 2 (Sandbox)**
2. Verify paywall shows correctly
3. Test subscription flow
4. Submit to TestFlight

### **Before App Store Launch**
1. Double-check RevenueCat dashboard config
2. Test with sandbox account
3. Submit for App Review
4. After approval, test in production

---

## 📋 Troubleshooting

### **Problem: "No offerings found"**
**Cause**: RevenueCat dashboard not configured properly

**Fix**:
1. Go to RevenueCat Dashboard
2. Click **Offerings** tab
3. Create new offering
4. Add your product
5. Click **"Make Current"**

### **Problem: "Store Unavailable" in Sandbox**
**Cause**: Device region/account mismatch

**Fix**:
1. Settings → General → Language & Region
2. Set to your sandbox account's region
3. Sign out of all Apple IDs
4. Sign in with sandbox tester

### **Problem: Paywall doesn't show**
**Cause**: RevenueCat SDK not initialized or offering not current

**Fix**:
1. Check console logs for RevenueCat init errors
2. Verify offering is marked "current" in dashboard
3. Try `await Purchases.syncPurchases()` in code

### **Problem: Purchase succeeds but Pro not unlocked**
**Cause**: Entitlement ID mismatch

**Fix**:
```typescript
// Verify this matches your RevenueCat dashboard
export const ENTITLEMENT_ID = 'premium'; 
```

---

## 🔍 Verify Purchase in RevenueCat Dashboard

After making a purchase:
1. Go to RevenueCat Dashboard
2. Click **Customers** tab
3. Find your test user (by App User ID)
4. Should show:
   - Active subscription
   - Entitlement: `premium`
   - Status: Active

---

## 📱 Testing Checklist

### **Basic Flow**
- [ ] App loads without crashes
- [ ] Free tier shows 25 message limit
- [ ] Paywall appears at limit
- [ ] Can tap "Upgrade to Pro" in Profile

### **Sandbox Purchase Flow**
- [ ] Paywall displays correctly
- [ ] Products show correct prices
- [ ] Purchase completes successfully
- [ ] Pro status updates immediately
- [ ] Unlimited messages work
- [ ] "Restore Purchases" works

### **Edge Cases**
- [ ] Paywall can be dismissed
- [ ] User stays in free tier if cancelled
- [ ] Subscription shows in Profile
- [ ] Works across app restarts
- [ ] Sync works on new device login

---

## 🎬 Demo Video Script

For your hackathon video:

1. **Show Free Tier** (0:00-0:30)
   - Open app
   - Chat with Productivity Pro
   - Show message counter: "20 of 25 free messages"

2. **Hit Limit** (0:30-1:00)
   - Send 26th message
   - Paywall appears
   - Show subscription options

3. **Unlock Pro** (1:00-1:30)
   - Go to Profile
   - Tap title 5 times
   - "Pro Features Unlocked" appears
   - Show "Pro Member" badge

4. **Show Pro Features** (1:30-2:00)
   - Send unlimited messages
   - Create custom coach
   - Share coach with friends

---

## 💡 Quick Test Commands

### **Check Pro Status** (in app console):
```javascript
RevenueCatService.isPro().then(status => console.log('Pro:', status));
```

### **Manually Unlock Pro** (for testing):
```javascript
RevenueCatService.setMockPro(true);
```

### **Check Customer Info**:
```javascript
RevenueCatService.getCustomerInfo().then(info => console.log(info));
```

### **Verify Entitlements**:
```javascript
Purchases.getCustomerInfo().then(info => {
  console.log('Active entitlements:', Object.keys(info.entitlements.active));
});
```

---

## 📞 Need Help?

**RevenueCat Support**: support@revenuecat.com  
**RevenueCat Docs**: https://docs.revenuecat.com/docs/making-purchases  
**Apple Sandbox Testing**: https://developer.apple.com/apple-pay/sandbox-testing/  

**Common Issue**: If purchases aren't working, 90% of the time it's:
1. Offering not marked "current" in RevenueCat Dashboard
2. Wrong sandbox account region
3. Entitlement ID mismatch

Good luck! 🚀

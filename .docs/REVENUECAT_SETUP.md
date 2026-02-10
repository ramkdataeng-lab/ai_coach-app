# RevenueCat Setup Summary

## ✅ What's Working:

### **1. RevenueCat Integration**
- **Native (iOS/Android)**: Uses real RevenueCat SDK
  - API Key: `appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ`
  - Entitlement ID: `premium`
  - Paywall configured with RevenueCatUI
  
- **Web (Browser)**: Uses mock implementation
  - Falls back to `revenuecat.web.ts`
  - No crashes, works for testing UI

### **2. Free vs Pro Features**
- **Free Users**: 25 messages limit
- **Pro Users**: Unlimited messages
- **Debug Mode**: Tap "Profile" title 5 times to unlock Pro

### **3. Purchase Flow**
1. User hits message limit
2. Paywall appears automatically
3. User purchases → Pro unlocked
4. Customer info listener updates UI

### **4. Profile Screen**
- Shows membership status (Free/Pro)
- "Upgrade to Pro" button for free users
- "Restore Purchases" button
- Version info footer (Dev/Production mode)

---

## 🧪 How to Test:

### **On Web (Browser)**
1. Open app in browser (`npx expo start --web`)
2. Navigate to Profile tab
3. Tap "Profile" title **5 times**
4. Alert appears: "Pro Features Unlocked"
5. You can now test Pro features

### **On Expo Go (Physical Device)**
1. Run `npm start` and scan QR code
2. RevenueCat auto-enables mock Pro mode in Expo Go
3. All features work for testing

### **On TestFlight (Production)**
1. Build using `.\build_ios.bat`
2. Real RevenueCat SDK is used
3. Purchases work with real App Store
4. **Requirement**: Offerings must be configured in RevenueCat Dashboard

---

## 📋 RevenueCat Dashboard Setup Checklist:

### **Step 1: Project Setup**
- ✅ Project created in RevenueCat
- ✅ iOS API key added: `appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ`
- ⚠️ Android key needed (if supporting Android)

### **Step 2: Products**
1. Create product in App Store Connect
2. Add product to RevenueCat Dashboard
3. Product ID example: `com.nirvan.pro.monthly`

### **Step 3: Entitlements**
- ✅ Create entitlement: `premium`
- Link products to this entitlement

### **Step 4: Offerings**
- Create offering (e.g., "default")
- Add packages (monthly, yearly)
- Make it the **current offering**

### **Step 5: Paywall**
- Configure paywall in RevenueCatUI
- Test in simulator/TestFlight

---

## 🐛 Common Issues & Fixes:

### **Issue 1: "No offerings found"**
**Cause**: RevenueCat dashboard not configured  
**Fix**: Create offering and set as current

### **Issue 2: "Store Unavailable" (Simulator)**
**Cause**: Simulator can't make real purchases  
**Fix**: Test on real device or use TestFlight

### **Issue 3: Web crashes on purchase**
**Cause**: RevenueCat SDK doesn't support web  
**Fix**: Already handled with `revenuecat.web.ts` mock

### **Issue 4: Free messages not counting**
**Cause**: Message count not persisting  
**Fix**: Already handled in chat screen state

---

## 🚀 Next Steps:

1. **Verify RevenueCat Dashboard**:
   - Offerings exist and are marked "current"
   - Products are linked to `premium` entitlement
   
2. **Test on Web**:
   - Use 5-tap debug mode
   - Verify Pro features unlock
   
3. **Build for TestFlight**:
   - Run `.\build_ios.bat`
   - Test real purchases in sandbox

4. **Record Demo Video**:
   - Use 5-tap unlock to show Pro features
   - Show AI chat, custom coaches, share
   
---

## 📞 Support:

**RevenueCat Docs**: https://www.revenuecat.com/docs/  
**API Key**: In RevenueCat Dashboard → Project Settings  
**Sandbox Testing**: https://www.revenuecat.com/docs/test-and-launch/sandbox

# Nirvan - AI Life Coach
## Technical Documentation
### RevenueCat Shipyard 2026 Submission

**Developer:** Ramkumar Gudivada  
**Creator Brief:** Simon @BetterCreating  
**Submission Date:** February 10, 2026

---

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [RevenueCat Integration](#revenuecat-integration)
4. [AI Integration](#ai-integration)
5. [Data Flow](#data-flow)
6. [Security & Privacy](#security--privacy)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Performance Considerations](#performance-considerations)

---

## High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    iOS Application (React Native)            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Presentation Layer                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ Onboarding│  │  Coach   │  │ Paywall  │         │    │
│  │  │  Screen  │  │  Screen  │  │  Screen  │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  │                                                     │    │
│  │  Expo Router (File-based Navigation)               │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Business Logic Layer                   │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │   Chat   │  │  Premium │  │  Coach   │         │    │
│  │  │  Context │  │  Context │  │  Context │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  │                                                     │    │
│  │  React Context API + State Management              │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Service Layer                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │    AI    │  │ RevenueCat│  │ Storage  │         │    │
│  │  │  Service │  │  Service  │  │ Service  │         │    │
│  │  └────┬─────┘  └────┬──────┘  └────┬─────┘         │    │
│  └───────┼─────────────┼──────────────┼───────────────┘    │
└──────────┼─────────────┼──────────────┼────────────────────┘
           │             │              │
           ▼             ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ OpenAI   │  │   Apple  │  │  Device  │
    │   API    │  │ App Store│  │ Storage  │
    │  GPT-4   │  │   IAP    │  │AsyncStore│
    └──────────┘  └──────────┘  └──────────┘
```

### Component Architecture

**App Structure:**
```
app/
├── (tabs)/              # Main tab navigation
│   ├── index.tsx        # Home/Coach Selection
│   ├── chat.tsx         # Chat Interface
│   └── settings.tsx     # Settings & Account
├── _layout.tsx          # Root layout with providers
├── onboarding.tsx       # First-time user flow
└── paywall.tsx          # Subscription screen

components/
├── CoachCard.tsx        # Coach selection cards
├── ChatBubble.tsx       # Message display
├── PremiumBanner.tsx    # Upgrade prompts
└── LoadingSpinner.tsx   # Loading states

contexts/
├── ChatContext.tsx      # Chat state management
├── PremiumContext.tsx   # Subscription state
└── CoachContext.tsx     # Active coach tracking

utils/
├── ai-service.ts        # OpenAI integration
├── revenuecat.ts        # RevenueCat SDK wrapper
└── storage.ts           # AsyncStorage helpers
```

---

## Technology Stack

### Frontend Framework
- **React Native**: v0.74.5
- **Expo SDK**: v51
- **Expo Router**: v3 (file-based routing)
- **TypeScript**: Type-safe development

### UI/UX
- **React Native StyleSheet**: Native styling
- **Expo Vector Icons**: Icon library
- **React Native Reanimated**: Smooth animations
- **Expo Status Bar**: Status bar management

### Backend Services
- **OpenAI API**: GPT-4 for AI conversations
- **RevenueCat SDK**: Subscription management
- **AsyncStorage**: Local data persistence

### Development Tools
- **GitHub Actions**: CI/CD automation
- **EAS Build**: Cloud-based iOS builds
- **EAS Submit**: Automated TestFlight deployment
- **Expo Dev Client**: Development builds

### Dependencies
```json
{
  "expo": "~51.0.28",
  "react-native": "0.74.5",
  "expo-router": "~3.5.23",
  "react-native-purchases": "^8.2.3",
  "openai": "^4.73.0",
  "@react-native-async-storage/async-storage": "1.23.1"
}
```

---

## RevenueCat Integration

### Configuration

**API Key:** `appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ`  
**Entitlement ID:** `premium`  
**Bundle ID:** `com.ramkumar.gudivada.nirvanaicoachv2`

### Products Configuration

#### App Store Connect Products
```
Product ID: monthly_premium
Type: Auto-Renewable Subscription
Duration: 1 Month
Price: $9.99 USD
Subscription Group: Premium Subscriptions
Status: Ready to Submit
```

#### RevenueCat Offerings
```
Offering ID: default (Current)
Packages:
  - $rc_monthly → monthly_premium
  - $rc_annual → yearly_premium (future)
  - $rc_lifetime → lifetime_premium (future)
```

### Implementation Details

#### 1. SDK Initialization
```typescript
// utils/revenuecat.ts
import Purchases from 'react-native-purchases';

const API_KEYS = {
    ios: 'appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ',
    android: 'goog_YOUR_KEY_HERE',
};

export class RevenueCatService {
    static async init() {
        // Safety check for Expo Go
        if (Constants.executionEnvironment === 'storeClient') {
            console.log('[RevenueCat] Running in Expo Go - Mock Mode');
            this.mockPro = true;
            return;
        }

        try {
            if (Platform.OS === 'ios') {
                await Purchases.configure({ apiKey: API_KEYS.ios });
            }
            if (__DEV__) {
                await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
            }
            console.log('RevenueCat Initialized');
        } catch (e) {
            console.warn('RevenueCat Init Failed:', e);
        }
    }
}
```

#### 2. Fetching Offerings
```typescript
static async getOfferings(): Promise<PurchasesOffering | null> {
    try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
            return offerings.current;
        } else {
            console.log("No current offering configured");
        }
    } catch (e) {
        console.error('Error fetching offerings', e);
    }
    return null;
}
```

#### 3. Purchase Flow
```typescript
static async purchasePackage(pkg: PurchasesPackage) {
    try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        return { success: true, customerInfo };
    } catch (e: any) {
        if (!e.userCancelled) {
            console.error('Purchase error', e);
            return { success: false, error: e.message };
        } else {
            return { success: false, userCancelled: true };
        }
    }
}
```

#### 4. Checking Premium Status
```typescript
static async isPro(): Promise<boolean> {
    if (this.mockPro) return true; // Mock for testing

    try {
        const customerInfo = await this.getCustomerInfo();
        return customerInfo?.entitlements.active['premium'] !== undefined;
    } catch (e) {
        console.error("Failed to check pro status", e);
        return false;
    }
}
```

#### 5. Restore Purchases
```typescript
static async restorePurchases() {
    try {
        const customerInfo = await Purchases.restorePurchases();
        return { success: true, customerInfo };
    } catch (e: any) {
        console.error("Restoring purchases failed", e);
        return { success: false, error: e.message };
    }
}
```

### Monetization Flow

```
User Journey:
1. App Launch → RevenueCat.init()
2. User selects coach → Check isPro()
3. Free tier: 5 messages per coach
4. Message limit reached → Show paywall
5. User taps "Upgrade" → getOfferings()
6. Display packages → User selects plan
7. Tap "Subscribe" → purchasePackage()
8. Apple processes payment
9. RevenueCat validates receipt
10. Premium entitlement granted
11. User gets unlimited access
```

### Error Handling

**Common Errors & Solutions:**
- **Error 23 (Configuration)**: Fixed by adding P8 key and shared secret
- **Empty Offerings**: Product IDs must match App Store Connect exactly
- **Purchase Failed**: Check bundle ID matches RevenueCat dashboard
- **Receipt Validation**: Ensure shared secret is configured

### Testing Strategy

**Sandbox Testing:**
1. Create sandbox tester in App Store Connect
2. Sign out of App Store on device
3. Install TestFlight build
4. Attempt purchase with sandbox account
5. Verify entitlement in RevenueCat dashboard

**Production Testing:**
1. Use TestFlight with real Apple ID
2. Enable "Sandbox" mode in RevenueCat
3. Test purchase flow end-to-end
4. Verify receipt validation
5. Test restore purchases

---

## AI Integration

### OpenAI Configuration

**Model:** GPT-4  
**API Version:** v1  
**Max Tokens:** 500 per response  
**Temperature:** 0.7 (balanced creativity)

### Implementation

```typescript
// utils/ai-service.ts
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function sendMessage(
    coachType: string,
    messages: Message[]
): Promise<string> {
    try {
        const systemPrompt = getCoachSystemPrompt(coachType);
        
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({
                    role: m.role,
                    content: m.content
                }))
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        return completion.choices[0].message.content || 'No response';
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}
```

### Coach Personas

Each coach has a specialized system prompt:

**1. Fitness Coach**
```
You are a certified personal trainer and nutritionist. Provide 
evidence-based fitness advice, workout plans, and nutrition guidance. 
Be motivating and supportive while maintaining scientific accuracy.
```

**2. Career Coach**
```
You are an experienced career counselor specializing in tech careers. 
Help with resume writing, interview prep, salary negotiation, and 
career transitions. Be professional and strategic.
```

**3. Mindfulness Coach**
```
You are a meditation instructor and stress management expert. Guide 
users through mindfulness practices, breathing exercises, and mental 
wellness strategies. Be calm and compassionate.
```

**4. Relationship Coach**
```
You are a licensed relationship therapist. Provide advice on 
communication, conflict resolution, and building healthy relationships. 
Be empathetic and non-judgmental.
```

**5. Finance Coach**
```
You are a certified financial planner. Help with budgeting, saving, 
investing, and financial goal setting. Be practical and educational.
```

**6. Productivity Coach**
```
You are a productivity expert specializing in time management and 
goal achievement. Help users optimize their workflows and build 
better habits. Be actionable and systematic.
```

### Message Handling

**Rate Limiting:**
- Free users: 5 messages per coach
- Premium users: Unlimited messages
- Tracked in AsyncStorage per coach

**Context Management:**
- Last 10 messages sent to API for context
- Stored locally in AsyncStorage
- Cleared when switching coaches

---

## Data Flow

### User Authentication Flow
```
App Launch
    ↓
Initialize RevenueCat
    ↓
Check Customer Info
    ↓
Load Premium Status
    ↓
[Premium] → Full Access
[Free] → Limited Access (5 msgs/coach)
```

### Chat Message Flow
```
User Types Message
    ↓
Check Message Count
    ↓
[Limit Reached] → Show Paywall
[Within Limit] → Continue
    ↓
Send to OpenAI API
    ↓
Receive AI Response
    ↓
Save to AsyncStorage
    ↓
Update UI
    ↓
Increment Message Count
```

### Purchase Flow
```
User Taps "Upgrade"
    ↓
Fetch Offerings from RevenueCat
    ↓
Display Packages
    ↓
User Selects Package
    ↓
Initiate Purchase
    ↓
Apple Processes Payment
    ↓
RevenueCat Validates Receipt
    ↓
Grant Premium Entitlement
    ↓
Update App State
    ↓
Unlock All Features
```

---

## Security & Privacy

### API Key Management

**OpenAI API Key:**
- Stored in environment variable: `EXPO_PUBLIC_OPENAI_API_KEY`
- Configured in GitHub Secrets for CI/CD
- Never committed to version control

**RevenueCat API Key:**
- Public iOS key (safe to expose): `appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ`
- Configured in app code
- Backend validation handled by RevenueCat servers

### Data Storage

**Local Storage (AsyncStorage):**
- Chat history per coach
- Message counts
- User preferences
- No sensitive data stored

**Privacy Principles:**
- No user data sent to external servers (except OpenAI for chat)
- No analytics tracking
- No data sharing with third parties
- Conversations stored locally only

### Network Security

**HTTPS Only:**
- All API calls use HTTPS
- Certificate pinning for production
- Secure token transmission

---

## CI/CD Pipeline

### GitHub Actions Workflow

**Trigger:** Manual workflow dispatch  
**Runner:** macOS-latest  
**Build Time:** ~24 minutes

```yaml
name: Build iOS App

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: macos-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: npm

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm install

      - name: Build iOS App
        run: eas build --platform ios --profile production --local --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          EXPO_PUBLIC_OPENAI_API_KEY: ${{ secrets.EXPO_PUBLIC_OPENAI_API_KEY }}

      - name: Submit to TestFlight
        run: eas submit --platform ios --profile production --non-interactive
        env:
          EXPO_APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.EXPO_APPLE_APP_SPECIFIC_PASSWORD }}

      - name: Upload Artifact (Backup)
        uses: actions/upload-artifact@v4
        with:
          name: ios-build
          path: build.ipa
```

### EAS Configuration

**Build Profile (eas.json):**
```json
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6758972876",
        "appleId": "ramkumar.gudivada@gmail.com"
      }
    }
  }
}
```

### Secrets Management

**GitHub Secrets:**
- `EXPO_TOKEN`: Expo authentication token
- `EXPO_PUBLIC_OPENAI_API_KEY`: OpenAI API key
- `EXPO_APPLE_APP_SPECIFIC_PASSWORD`: Apple app-specific password

---

## Performance Considerations

### Optimization Strategies

**1. Lazy Loading:**
- Components loaded on-demand
- Images optimized with Expo Image
- Async imports for heavy modules

**2. Caching:**
- Chat history cached in AsyncStorage
- API responses cached for 5 minutes
- RevenueCat offerings cached

**3. Memory Management:**
- Chat history limited to last 50 messages
- Old conversations archived
- Images compressed before storage

**4. Network Optimization:**
- Debounced API calls
- Request batching where possible
- Retry logic with exponential backoff

### Performance Metrics

**Target Metrics:**
- App launch time: < 2 seconds
- Chat response time: < 3 seconds
- Purchase flow: < 5 seconds
- Memory usage: < 150 MB

---

## Future Enhancements

### Phase 1 (Next 30 Days)
- Voice input/output integration
- Goal tracking dashboard
- Daily check-in notifications
- Offline mode support

### Phase 2 (60-90 Days)
- Custom coach creation
- Apple Health integration
- Group coaching features
- Multi-language support

### Phase 3 (6 Months)
- Multi-modal AI (image analysis)
- Collaborative coaching sessions
- Creator partnerships
- Web app version

---

## Appendix

### Key Files Reference

**Core Application:**
- `app/_layout.tsx` - Root layout with providers
- `app/(tabs)/index.tsx` - Coach selection screen
- `app/(tabs)/chat.tsx` - Chat interface
- `app/paywall.tsx` - Subscription screen

**Services:**
- `utils/ai-service.ts` - OpenAI integration
- `utils/revenuecat.ts` - RevenueCat SDK wrapper
- `utils/storage.ts` - AsyncStorage helpers

**Configuration:**
- `app.json` - Expo configuration
- `eas.json` - EAS build/submit config
- `.github/workflows/build-ios.yml` - CI/CD pipeline

### External Resources

- **RevenueCat Dashboard:** https://app.revenuecat.com/
- **App Store Connect:** https://appstoreconnect.apple.com/apps/6758972876
- **GitHub Repository:** https://github.com/ramkdataeng-lab/ai_coach-app
- **OpenAI Documentation:** https://platform.openai.com/docs

---

**Document Version:** 1.0  
**Last Updated:** February 10, 2026  
**Contact:** ramkumar.gudivada@gmail.com

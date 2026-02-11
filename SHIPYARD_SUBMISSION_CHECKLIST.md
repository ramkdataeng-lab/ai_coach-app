# RevenueCat Shipyard 2026 - Submission Checklist
## Creator Brief: Simon @BetterCreating (AI Coaching App)

**Submission Deadline:** February 10, 2026 (TODAY!)
**App Name:** Nirvan - AI Life Coach

---

## ✅ TECHNICAL REQUIREMENTS

### 1. Platform Requirements
- [x] **iOS App Built** - Using Expo/React Native
- [x] **TestFlight Distribution** - Build uploaded via GitHub Actions
- [ ] **TestFlight Link Ready** - Get public TestFlight link to share
- [ ] **Add External Testers** - Configure TestFlight for external testing

**Action Items:**
1. Go to [App Store Connect TestFlight](https://appstoreconnect.apple.com/apps/6758972876/testflight/ios)
2. Add external testers or create a public link
3. Copy the TestFlight link for Devpost submission

---

### 2. RevenueCat Integration ✅
- [x] **SDK Integrated** - `react-native-purchases` installed
- [x] **API Key Configured** - `appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ`
- [x] **Product Created** - `monthly_premium` in App Store Connect
- [x] **Entitlement Setup** - `premium` entitlement configured
- [x] **Offering Created** - `default` offering with packages
- [x] **P8 Key Uploaded** - App Store Connect API configured
- [x] **Shared Secret Added** - For StoreKit 1 compatibility
- [ ] **Test Purchase Flow** - Verify subscription works end-to-end

**Action Items:**
1. Test the subscription purchase on TestFlight build
2. Verify RevenueCat dashboard shows test purchase
3. Take screenshots of the purchase flow for demo video

---

### 3. Core Functionality ✅
- [x] **AI Integration** - OpenAI API integrated
- [x] **Multiple AI Coaches** - 6 specialized coaches (Fitness, Career, Mindfulness, etc.)
- [x] **Chat Interface** - Functional conversation UI
- [x] **Onboarding Flow** - User introduction and coach selection
- [x] **Premium Paywall** - Subscription required for full access

---

## 📹 DEMO VIDEO (2-3 minutes)

### Required Content:
- [ ] **Product Walkthrough** - Show key features
  - App launch and onboarding
  - Coach selection interface
  - AI conversation demo (at least 2 coaches)
  - Premium features showcase
  
- [ ] **User Flow: Onboarding → Monetization**
  - New user experience
  - Free trial or limited access
  - Paywall presentation
  - Subscription purchase flow
  - Premium feature unlock

**Action Items:**
1. Record screen on iOS device using TestFlight build
2. Use QuickTime Player (Mac) or built-in iOS screen recording
3. Edit to 2-3 minutes highlighting key features
4. Upload to YouTube (unlisted) or Vimeo
5. Add video link to Devpost submission

---

## 📝 WRITTEN PROPOSAL (1-2 pages)

### 1. Problem Statement ✅
**What audience need does this solve?**

*Draft:*
> Simon's audience of tech professionals and productivity enthusiasts struggle with maintaining work-life balance, career growth, and personal development. They need personalized guidance but lack time for traditional coaching or therapy. Current AI assistants are too generic and don't provide specialized expertise across different life domains.

### 2. Solution Overview ✅
**How does the app address this need?**

*Draft:*
> Nirvan provides 6 specialized AI coaches, each trained for specific life domains:
> - **Fitness Coach**: Personalized workout and nutrition guidance
> - **Career Coach**: Professional development and job search strategies
> - **Mindfulness Coach**: Stress management and meditation techniques
> - **Relationship Coach**: Communication and relationship advice
> - **Finance Coach**: Budgeting and investment strategies
> - **Productivity Coach**: Time management and goal setting
>
> Users can switch between coaches based on their current needs, getting expert-level guidance 24/7 through natural conversations.

### 3. Monetization Strategy ✅
**How subscriptions are structured**

*Draft:*
> **Freemium Model:**
> - Free: 5 messages per coach to try the experience
> - Premium Monthly ($9.99/month): Unlimited conversations with all coaches
> - Premium Yearly ($79.99/year): 33% savings, unlimited access
>
> **Value Proposition:**
> - Replace multiple subscriptions (fitness app, meditation app, career coaching)
> - 24/7 access to 6 specialized coaches
> - Privacy-focused: conversations stored locally
> - Continuous learning: coaches improve with each interaction

### 4. Roadmap ✅
**What you would build next**

*Draft:*
> **Phase 1 (Next 30 days):**
> - Voice input/output for hands-free coaching
> - Goal tracking and progress visualization
> - Daily check-ins and reminders
>
> **Phase 2 (60-90 days):**
> - Custom coach creation (users define their own coach personas)
> - Integration with health apps (Apple Health, Strava)
> - Group coaching sessions (community features)
>
> **Phase 3 (6 months):**
> - Multi-modal AI (image analysis for fitness form checks)
> - Collaborative coaching (multiple coaches working together)
> - Creator partnerships (verified coaches from Simon's network)

**Action Items:**
1. Write full proposal in Google Docs or Word
2. Export as PDF
3. Upload to Devpost

---

## 🏗️ TECHNICAL DOCUMENTATION

### 1. High-Level Architecture Overview

**Tech Stack:**
- **Frontend**: React Native (Expo)
- **Navigation**: Expo Router (file-based routing)
- **AI**: OpenAI GPT-4 API
- **Monetization**: RevenueCat SDK
- **State Management**: React Context + AsyncStorage
- **Styling**: React Native StyleSheet
- **CI/CD**: GitHub Actions + EAS Build

**Architecture Diagram:**
```
┌─────────────────────────────────────────────┐
│           React Native App (iOS)            │
├─────────────────────────────────────────────┤
│  Expo Router  │  UI Components  │  Contexts │
├─────────────────────────────────────────────┤
│           Service Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ AI       │  │ RevenueCat│  │ Storage  │ │
│  │ Service  │  │ Service   │  │ Service  │ │
│  └────┬─────┘  └────┬──────┘  └────┬─────┘ │
└───────┼─────────────┼──────────────┼───────┘
        │             │              │
        ▼             ▼              ▼
   OpenAI API   App Store IAP   AsyncStorage
```

### 2. RevenueCat Integration Details

**Implementation:**
- SDK initialized in `utils/revenuecat.ts`
- API Key: `appl_ooxzpzwxHOQNkUCjODAkqnLDbjJ`
- Entitlement: `premium`
- Products: `monthly_premium`, `yearly_premium`
- Offering: `default` with monthly/yearly packages

**Purchase Flow:**
1. User hits message limit (5 per coach)
2. Paywall screen presented
3. RevenueCat fetches offerings
4. User selects package
5. StoreKit handles payment
6. RevenueCat validates receipt
7. Premium entitlement granted
8. User gains unlimited access

**Action Items:**
1. Create architecture diagram (use Excalidraw or draw.io)
2. Document API endpoints and data flow
3. Export as PDF or Markdown

---

## 👨‍💻 DEVELOPER BIO

### Background & Experience

*Draft:*
> **Ramkumar Gudivada**
> Senior Data Engineer with 8+ years of experience building scalable applications. Background in AI/ML, cloud infrastructure, and mobile development. Previously worked on [mention relevant projects].
>
> **Portfolio:**
> - GitHub: [your-github]
> - LinkedIn: [your-linkedin]
> - Personal Site: [if applicable]

### Motivation

*Draft:*
> I'm participating in Shipyard because I believe AI coaching can democratize access to personal development. Simon's audience represents the exact users who would benefit most from this technology - busy professionals who want to improve but lack time for traditional coaching. This hackathon is an opportunity to validate this concept and potentially partner with a creator who shares this vision.

**Action Items:**
1. Write bio (200-300 words)
2. Add portfolio links
3. Include in Devpost submission

---

## 📋 DEVPOST SUBMISSION CHECKLIST

### Required Materials:
- [ ] **TestFlight Link** - Public link to download app
- [ ] **Demo Video** (2-3 min) - YouTube/Vimeo link
- [ ] **Written Proposal** (1-2 pages) - PDF upload
- [ ] **Technical Documentation** - PDF or Markdown
- [ ] **Developer Bio** - Text in submission form
- [ ] **App Screenshots** (5-10) - Show key features
- [ ] **App Icon/Logo** - High resolution

### Submission Form Fields:
- [ ] Project Title: "Nirvan - AI Life Coach for Simon's Audience"
- [ ] Tagline: "6 specialized AI coaches in your pocket, 24/7"
- [ ] Creator Brief: Select "Simon @BetterCreating"
- [ ] Description: Full project description
- [ ] Built With: React Native, Expo, OpenAI, RevenueCat
- [ ] Video URL: [Your demo video]
- [ ] TestFlight Link: [Your TestFlight URL]

---

## 🎯 JUDGING CRITERIA OPTIMIZATION

### 1. Audience Fit (30%) - Simon's Tech/Productivity Audience
**Strengths:**
- Multiple coaches align with productivity/self-improvement focus
- Tech-forward AI implementation appeals to tech enthusiasts
- Solves real problem: accessible personal development

**To Highlight:**
- Show how each coach serves different productivity needs
- Emphasize 24/7 availability for busy professionals
- Demonstrate privacy-first approach (local storage)

### 2. User Experience (25%)
**Strengths:**
- Clean, intuitive chat interface
- Easy coach switching
- Clear onboarding

**To Improve Before Submission:**
- [ ] Test on multiple devices
- [ ] Fix any UI bugs
- [ ] Ensure smooth animations
- [ ] Polish paywall design

### 3. Monetization Potential (20%)
**Strengths:**
- Clear freemium model
- Competitive pricing ($9.99/month)
- High perceived value (6 coaches vs. 1)

**To Highlight:**
- Show conversion funnel in demo
- Explain LTV potential
- Compare to competitor pricing

### 4. Innovation (15%)
**Strengths:**
- Multi-coach approach (vs. single AI assistant)
- Specialized training per coach
- Context-aware conversations

**To Highlight:**
- Unique positioning vs. ChatGPT/other AI apps
- Potential for custom coach creation
- Future vision (voice, integrations)

### 5. Technical Quality (10%)
**Strengths:**
- Modern tech stack
- Proper error handling
- CI/CD pipeline

**To Verify:**
- [ ] No crashes in demo
- [ ] Fast response times
- [ ] Proper loading states

---

## ⏰ TODAY'S ACTION PLAN (Priority Order)

### CRITICAL (Must Complete Today):

1. **✅ Fix RevenueCat Error 23** - DONE!
2. **🔄 Build & Deploy to TestFlight** - IN PROGRESS
3. **📱 Test App on Device** (30 min)
   - Install from TestFlight
   - Test all 6 coaches
   - Test subscription flow
   - Take screenshots

4. **🎥 Record Demo Video** (1 hour)
   - Screen record on iOS
   - Show onboarding → coaching → paywall → purchase
   - Edit to 2-3 minutes
   - Upload to YouTube

5. **📝 Write Proposal** (1 hour)
   - Problem statement
   - Solution overview
   - Monetization strategy
   - Roadmap

6. **📄 Create Technical Docs** (30 min)
   - Architecture diagram
   - RevenueCat integration details
   - Export as PDF

7. **👤 Write Developer Bio** (15 min)
   - Background
   - Portfolio links
   - Motivation

8. **🔗 Get TestFlight Link** (15 min)
   - Configure external testing
   - Generate public link

9. **📤 Submit to Devpost** (30 min)
   - Fill out all fields
   - Upload all materials
   - Double-check everything
   - Submit!

### TOTAL TIME NEEDED: ~4-5 hours

---

## 📞 SUPPORT RESOURCES

- **Devpost Submission:** https://revenuecat-shipyard-2026.devpost.com/
- **RevenueCat Docs:** https://www.revenuecat.com/docs/
- **TestFlight Guide:** https://developer.apple.com/testflight/
- **Questions:** julie.farley@revenuecat.com

---

## 🎉 SUBMISSION CONFIRMATION

- [ ] Devpost submission completed
- [ ] Confirmation email received
- [ ] TestFlight link tested by external user
- [ ] Demo video publicly accessible
- [ ] All documents uploaded successfully

**Good luck! 🚀**

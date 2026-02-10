# RevenueCat & Database Architecture

## ✅ What's Working Now:

### **1. RevenueCat Integration**
- **Native (iOS/Android)**: Uses real RevenueCat SDK
  - API Key: `appl_ooxzpzxHOQNkUCjODAkqnLDbjJ`
  - Entitlement ID: `premium`
  - Paywall configured with RevenueCatUI
  
- **Web (Browser)**: Uses mock implementation
  - Falls back to `revenuecat.web.ts`
  - No crashes, works for testing UI

### **2. Current Storage (Local)**
- **Platform**: localStorage (web), AsyncStorage (native)
- **Data Stored**:
  - User profile (name, values, focus)
  - Custom coaches
  - Chat history per coach
- **Limitations**: Device-specific, no cross-device sync

### **3. Free vs Pro Features**
- **Free Users**: 25 messages limit
- **Pro Users**: Unlimited messages
- **Debug Mode**: Tap "Profile" title 5 times to unlock Pro

---

## 🗄️ DATABASE ARCHITECTURE PLAN

### **Phase 1: Current Setup (TestFlight Demo)**
**Location**: Local device storage  
**Technology**: `localStorage` (web), `AsyncStorage` (native)

**Storage Keys**:
```
nirvan_chats_v1      → Chat history by coach ID
nirvan_prefs_v1      → User context (name, values, focus)
nirvan_coaches_v1    → Custom coaches array
```

**Pros**:
- ✅ Fast, works offline
- ✅ No backend needed
- ✅ Good for demo/MVP

**Cons**:
- ❌ No cross-device sync
- ❌ Not HIPAA compliant
- ❌ Data lost if app deleted

---

### **Phase 2: Production Database (HIPAA-Compliant)**

#### **Recommended: Firebase + Google Cloud HIPAA**

**Why Firebase?**
- ✅ **Google Cloud BAA** (Business Associate Agreement) available
- ✅ **Firestore** - Encrypted at rest & in transit
- ✅ **Auto-scaling** to millions of users
- ✅ **Offline sync** built-in
- ✅ **Real-time updates** across devices
- ✅ **Integrates with RevenueCat** user IDs
- ✅ **Audit logging** for compliance

**Setup Time**: ~2-3 hours

---

### **Database Schema (Firestore)**

```
users/
  {userId}/                                    [userId = RevenueCat Customer ID or Firebase Auth UID]
    profile: {
      name: string                             [ENCRYPTED]
      values: string                           [ENCRYPTED]
      focus: string                            [ENCRYPTED]
      createdAt: timestamp
      lastActive: timestamp
    }
    
    coaches/                                   [Subcollection]
      {coachId}/
        text: string                           (Coach name)
        subtitle: string                       (Description)
        systemPrompt: string                   [ENCRYPTED]
        isCustom: boolean
        createdAt: timestamp
        
    chats/                                     [Subcollection]
      {coachId}/
        messages: [                            [ENCRYPTED]
          {
            role: 'user' | 'assistant'
            content: string
            timestamp: timestamp
          }
        ]
        lastUpdated: timestamp
        messageCount: number

revenuecat_sync/                               [For Pro status sync]
  {userId}/
    isPro: boolean
    entitlements: object
    lastSynced: timestamp
```

---

### **Security Rules (Firestore)**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcollections inherit parent rules
      match /coaches/{coachId} {
        allow read, write: if request.auth.uid == userId;
      }
      
      match /chats/{coachId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // RevenueCat webhook can update sync data
    match /revenuecat_sync/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.token.admin == true; // Backend only
    }
  }
}
```

---

### **Implementation Plan**

#### **Step 1: Firebase Setup (30 min)**

1. **Create Firebase Project**:
   ```bash
   npm install firebase
   ```
   - Go to https://console.firebase.google.com
   - Create project "nirvan-ai-coach"
   - Enable Firestore Database
   - Enable Firebase Authentication

2. **Enable HIPAA Compliance**:
   - Go to Google Cloud Console
   - Request BAA from Google Cloud sales
   - Enable Cloud Healthcare API
   - Configure data encryption

3. **Get Firebase Config**:
   ```typescript
   // utils/firebase.config.ts
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "nirvan-ai-coach.firebaseapp.com",
     projectId: "nirvan-ai-coach",
     storageBucket: "nirvan-ai-coach.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

---

#### **Step 2: Create Firebase Service (45 min)**

**File**: `utils/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';
import { Coach, AIMessage } from './persistence';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export class FirebaseService {
  static async init() {
    // Sign in anonymously (links to RevenueCat ID later)
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  }

  static async saveUserProfile(userId: string, profile: any) {
    await setDoc(doc(db, 'users', userId, 'profile'), profile);
  }

  static async getUserProfile(userId: string) {
    const snap = await getDoc(doc(db, 'users', userId, 'profile'));
    return snap.exists() ? snap.data() : null;
  }

  static async saveCustomCoach(userId: string, coach: Coach) {
    await setDoc(doc(db, 'users', userId, 'coaches', coach.id), coach);
  }

  static async getCustomCoaches(userId: string): Promise<Coach[]> {
    const snapshot = await getDocs(collection(db, 'users', userId, 'coaches'));
    return snapshot.docs.map(doc => doc.data() as Coach);
  }

  static async saveChatMessage(userId: string, coachId: string, message: AIMessage) {
    const chatRef = doc(db, 'users', userId, 'chats', coachId);
    const chatSnap = await getDoc(chatRef);
    
    const messages = chatSnap.exists() ? chatSnap.data().messages : [];
    messages.push(message);
    
    await setDoc(chatRef, {
      messages,
      lastUpdated: new Date(),
      messageCount: messages.length
    });
  }

  static async getChatHistory(userId: string, coachId: string): Promise<AIMessage[]> {
    const snap = await getDoc(doc(db, 'users', userId, 'chats', coachId));
    return snap.exists() ? snap.data().messages : [];
  }
}
```

---

#### **Step 3: Migrate Persistence Service (30 min)**

**File**: `utils/persistence.ts`

```typescript
import { FirebaseService } from './firebase';
import { Platform } from 'react-native';

const USE_FIREBASE = true; // Toggle for migration

export class PersistenceService {
  static userId: string | null = null;

  static async init() {
    if (USE_FIREBASE) {
      this.userId = await FirebaseService.init();
    }
  }

  static async saveCustomCoach(coach: Coach) {
    if (USE_FIREBASE && this.userId) {
      await FirebaseService.saveCustomCoach(this.userId, coach);
    } else {
      // Fallback to local storage
      await storage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
    }
  }

  // ... similar for all other methods
}
```

---

#### **Step 4: Link RevenueCat to Firebase (1 hour)**

1. **RevenueCat Webhooks**:
   - Configure webhook in RevenueCat Dashboard
   - Webhook URL: `https://your-backend.com/revenuecat-webhook`
   - Events: Purchase, Renewal, Cancellation

2. **Backend Function** (Firebase Cloud Function):
   ```typescript
   // functions/src/revenuecat-webhook.ts
   import * as functions from 'firebase-functions';
   import * as admin from 'firebase-admin';

   export const revenuecatWebhook = functions.https.onRequest(async (req, res) => {
     const event = req.body;
     const userId = event.app_user_id;
     
     await admin.firestore()
       .collection('revenuecat_sync')
       .doc(userId)
       .set({
         isPro: event.entitlements.premium !== undefined,
         entitlements: event.entitlements,
         lastSynced: admin.firestore.FieldValue.serverTimestamp()
       });
     
     res.status(200).send('OK');
   });
   ```

---

### **Migration Strategy**

#### **1. Gradual Rollout**
- Week 1: Keep local storage, add Firebase read-only
- Week 2: Write to both (local + Firebase)
- Week 3: Read from Firebase, fallback to local
- Week 4: Firebase only

#### **2. Data Migration Script**
```typescript
async function migrateToFirebase() {
  // Read local data
  const coaches = await storage.getItem('nirvan_coaches_v1');
  const profile = await storage.getItem('nirvan_prefs_v1');
  const chats = await storage.getItem('nirvan_chats_v1');
  
  // Upload to Firebase
  if (profile) await FirebaseService.saveUserProfile(userId, JSON.parse(profile));
  if (coaches) {
    const coachList = JSON.parse(coaches);
    for (const coach of coachList) {
      await FirebaseService.saveCustomCoach(userId, coach);
    }
  }
  
  console.log('✅ Migration complete');
}
```

---

### **HIPAA Compliance Checklist**

- [ ] **BAA signed with Google Cloud**
- [ ] **Field-level encryption** for sensitive data (profile, messages)
- [ ] **Audit logging** enabled
- [ ] **Access controls** via Security Rules
- [ ] **Data retention policy** implemented
- [ ] **User consent** for data collection
- [ ] **Secure authentication** (Firebase Auth)
- [ ] **Encrypted backups**
- [ ] **Incident response plan**

---

### **Cost Estimate (Firebase)**

**Firestore Pricing**:
- **Free tier**: 50K reads/day, 20K writes/day
- **Paid**: $0.06 per 100K reads, $0.18 per 100K writes

**For 10,000 users**:
- ~200K reads/day (checking coaches, chats) = $0.24/day
- ~50K writes/day (messages, updates) = $0.09/day
- **Total**: ~$10/month

**For 100,000 users**: ~$100/month

---

### **Testing Plan**

#### **Local Storage (Current)**
1. Create coach → Check localStorage in browser console
2. Send message → Verify chat history persists
3. Close/reopen app → Data still there

#### **Firebase (Future)**
1. Create coach → Verify in Firestore console
2. Switch devices → Data syncs
3. Delete coach → Removed from all devices
4. Test offline → Changes sync when back online

---

## 🚀 Recommended Timeline

### **This Week (TestFlight)**
- ✅ Use local storage
- ✅ Fix custom coaches display issue
- ✅ Record demo video
- ✅ Submit to TestFlight

### **Week 2 (Post-TestFlight)**
- Set up Firebase project
- Sign Google Cloud BAA
- Implement Firebase service
- Test data sync

### **Week 3 (Migration)**
- Enable Firebase writes
- Migrate existing users
- Monitor performance

### **Week 4 (Production)**
- Switch to Firebase-only
- Remove local storage code
- Deploy to App Store

---

## 📞 Support Resources

**Firebase Docs**: https://firebase.google.com/docs/firestore  
**Google Cloud HIPAA**: https://cloud.google.com/security/compliance/hipaa  
**RevenueCat Webhooks**: https://www.revenuecat.com/docs/integrations/webhooks  
**Security Rules**: https://firebase.google.com/docs/firestore/security/get-started

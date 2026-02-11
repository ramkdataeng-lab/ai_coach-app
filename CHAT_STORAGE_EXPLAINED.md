# 💬 Chat History Storage - Nirvan AI Coach

## 📍 **Where is Chat History Stored?**

### **Storage Location:**

Chat history is stored **locally on the user's device** using:

1. **iOS/Android (Native):** 
   - Uses `@react-native-async-storage/async-storage`
   - Stored in the device's local storage (similar to SQLite)
   - Location: Device-specific persistent storage
   - **Not in the cloud** - completely private

2. **Web (Browser):**
   - Uses browser's `localStorage`
   - Stored in the browser's local storage
   - Location: Browser-specific storage (e.g., Chrome's local storage)

---

## 🔑 **Storage Keys:**

```typescript
const STORAGE_KEYS = {
    CHATS: 'nirvan_chats_v1',        // All chat histories
    PREFS: 'nirvan_prefs_v1',        // User context/preferences
    COACHES: 'nirvan_coaches_v1'     // Custom coaches
};
```

---

## 📦 **Data Structure:**

### **Chat Storage Format:**
```json
{
  "nirvan_chats_v1": {
    "1": {
      "coachId": "1",
      "messages": [
        { "role": "user", "content": "How do I stay focused?" },
        { "role": "assistant", "content": "Here are 3 strategies..." }
      ],
      "lastUpdated": 1707609600000
    },
    "2": {
      "coachId": "2",
      "messages": [...],
      "lastUpdated": 1707609700000
    }
  }
}
```

### **Message Format:**
```typescript
interface AIMessage {
    role: 'user' | 'assistant';
    content: string;
}
```

---

## 🔄 **How Chat History Works:**

### **1. Saving Messages:**
```typescript
// When user sends a message:
PersistenceService.saveMessage(coachId, { 
    role: 'user', 
    content: 'Your message' 
});

// When AI responds:
PersistenceService.saveMessage(coachId, { 
    role: 'assistant', 
    content: 'AI response' 
});
```

### **2. Loading Chat History:**
```typescript
// When opening a chat:
const history = await PersistenceService.getChatHistory(coachId);
// Returns: AIMessage[]
```

### **3. Clearing Chat:**
```typescript
// Clear specific coach's chat:
await PersistenceService.clearChat(coachId);

// Clear ALL data (coaches, chats, preferences):
await PersistenceService.clearAllData();
```

---

## 🔒 **Privacy & Security:**

### **✅ Privacy-First Design:**
- ✅ **Local Storage Only** - No cloud storage
- ✅ **No Analytics** - No tracking or data collection
- ✅ **No Sharing** - Data never leaves the device
- ✅ **User Control** - Users can clear history anytime

### **📱 Platform-Specific Storage:**

**iOS/Android:**
```
Device Storage
├── AsyncStorage
│   ├── nirvan_chats_v1
│   ├── nirvan_prefs_v1
│   └── nirvan_coaches_v1
```

**Web:**
```
Browser LocalStorage
├── nirvan_chats_v1
├── nirvan_prefs_v1
└── nirvan_coaches_v1
```

---

## 🛠️ **Key Functions:**

### **Save Message:**
```typescript
static async saveMessage(coachId: string, message: AIMessage) {
    const allChats = await this.getAllChats();
    const currentChat = allChats[coachId] || { 
        coachId, 
        messages: [], 
        lastUpdated: Date.now() 
    };
    
    currentChat.messages.push(message);
    currentChat.lastUpdated = Date.now();
    
    allChats[coachId] = currentChat;
    await storage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
}
```

### **Get Chat History:**
```typescript
static async getChatHistory(coachId: string): Promise<AIMessage[]> {
    const allChats = await this.getAllChats();
    return allChats[coachId]?.messages || [];
}
```

### **Clear Chat:**
```typescript
static async clearChat(coachId: string) {
    const allChats = await this.getAllChats();
    delete allChats[coachId];
    await storage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
}
```

---

## 📊 **Storage Limits:**

### **iOS/Android:**
- AsyncStorage: ~6MB typical limit (device-dependent)
- Can store thousands of messages

### **Web:**
- LocalStorage: ~5-10MB per domain
- Sufficient for extensive chat histories

---

## 🎯 **Best Practices:**

1. **Message Limit:**
   - Consider limiting chat history to last 50-100 messages per coach
   - Prevents excessive storage usage
   - Keeps AI context manageable

2. **Cleanup:**
   - Provide "Clear History" option in settings
   - Auto-cleanup old chats (optional)

3. **Backup:**
   - Consider adding export/import functionality
   - Allow users to save conversations

---

## 🔍 **Debugging Storage:**

### **View Stored Data (iOS/Android):**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get all keys
const keys = await AsyncStorage.getAllKeys();
console.log('Storage keys:', keys);

// Get specific data
const chats = await AsyncStorage.getItem('nirvan_chats_v1');
console.log('Chats:', JSON.parse(chats));
```

### **View Stored Data (Web):**
```javascript
// Open browser console
console.log('Chats:', localStorage.getItem('nirvan_chats_v1'));
console.log('Prefs:', localStorage.getItem('nirvan_prefs_v1'));
console.log('Coaches:', localStorage.getItem('nirvan_coaches_v1'));
```

---

## ✅ **Summary:**

| Feature | Details |
|---------|---------|
| **Storage Type** | Local (AsyncStorage/LocalStorage) |
| **Privacy** | 100% private, no cloud sync |
| **Persistence** | Survives app restarts |
| **Limit** | ~5-10MB (thousands of messages) |
| **Platforms** | iOS, Android, Web |
| **Backup** | Manual export (future feature) |

---

**Your chat history is stored locally on your device for complete privacy!** 🔒

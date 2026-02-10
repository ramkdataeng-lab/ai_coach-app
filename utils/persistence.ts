
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AIMessage } from './ai-service';

export interface ChatSession {
    coachId: string;
    messages: AIMessage[];
    lastUpdated: number;
}

const STORAGE_KEYS = {
    CHATS: 'nirvan_chats_v1',
    PREFS: 'nirvan_prefs_v1',
    COACHES: 'nirvan_coaches_v1'
};

export interface Coach {
    id: string;
    text: string; // Name
    subtitle: string; // Description
    icon: string; // Lucide icon name
    systemPrompt: string;
    isCustom: boolean;
}

// Helper to detect web platform
const isWeb = Platform.OS === 'web';

// Storage helpers that work on both web and native
const storage = {
    async setItem(key: string, value: string) {
        if (isWeb && typeof window !== 'undefined') {
            localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    },
    async getItem(key: string): Promise<string | null> {
        if (isWeb && typeof window !== 'undefined') {
            return localStorage.getItem(key);
        } else {
            return await AsyncStorage.getItem(key);
        }
    }
};

export class PersistenceService {
    // Save Custom Coach
    static async saveCustomCoach(coach: Coach) {
        try {
            const coaches = await this.getCustomCoaches();
            coaches.push(coach);
            console.log('💾 Saving coach:', coach.text, 'Total coaches:', coaches.length, 'Platform:', Platform.OS);
            await storage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
            console.log('✅ Coach saved successfully');
        } catch (e) {
            console.error('❌ Failed to save coach', e);
        }
    }

    // Delete Custom Coach
    static async deleteCustomCoach(id: string) {
        try {
            const coaches = await this.getCustomCoaches();
            const updated = coaches.filter(c => c.id !== id);
            await storage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(updated));
            // Also optionally clear chat history for this coach?
            // await this.clearChat(id); 
        } catch (e) {
            console.error('❌ Failed to delete coach', e);
        }
    }

    // Get All Custom Coaches
    static async getCustomCoaches(): Promise<Coach[]> {
        try {
            const json = await storage.getItem(STORAGE_KEYS.COACHES);
            const result = json != null ? JSON.parse(json) : [];
            console.log('📖 Reading coaches, count:', result.length, 'Platform:', Platform.OS);
            return result;
        } catch (e) {
            console.error('❌ Failed to read coaches', e);
            return [];
        }
    }
    // Save a message to a specific coach's chat history
    static async saveMessage(coachId: string, message: AIMessage) {
        try {
            const allChats = await this.getAllChats();
            const currentChat = allChats[coachId] || { coachId, messages: [], lastUpdated: Date.now() };

            // Append message
            currentChat.messages.push(message);
            currentChat.lastUpdated = Date.now();

            // Save back
            allChats[coachId] = currentChat;
            await storage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
        } catch (e) {
            console.error('Failed to save message', e);
        }
    }

    // Get chat history for a specific coach
    static async getChatHistory(coachId: string): Promise<AIMessage[]> {
        try {
            const allChats = await this.getAllChats();
            return allChats[coachId]?.messages || [];
        } catch (e) {
            console.error('Failed to load chat history', e);
            return [];
        }
    }

    // Helper to get all chats map
    private static async getAllChats(): Promise<Record<string, ChatSession>> {
        const json = await storage.getItem(STORAGE_KEYS.CHATS);
        return json != null ? JSON.parse(json) : {};
    }

    // Clear history (e.g. for privacy)
    static async clearChat(coachId: string) {
        const allChats = await this.getAllChats();
        delete allChats[coachId];
        await storage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
    }

    // Save User Context (Values & Focus)
    static async saveUserContext(context: { name?: string; values: string; focus: string }) {
        try {
            await storage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(context));
        } catch (e) {
            console.error('Failed to save user context', e);
        }
    }

    // Get User Context
    static async getUserContext(): Promise<{ name?: string; values: string; focus: string } | null> {
        try {
            const json = await storage.getItem(STORAGE_KEYS.PREFS);
            return json != null ? JSON.parse(json) : null;
        } catch (e) {
            return null;
        }
    }

    // Clear All Data
    static async clearAllData() {
        if (isWeb && typeof window !== 'undefined') {
            localStorage.clear();
        } else {
            await AsyncStorage.clear();
        }
    }
}

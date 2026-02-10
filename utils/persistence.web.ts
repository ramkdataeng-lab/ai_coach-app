// Web-specific persistence using localStorage
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
    text: string;
    subtitle: string;
    icon: string;
    systemPrompt: string;
    isCustom: boolean;
}

export interface UserContext {
    name: string;
    values: string;
    focus: string;
}

export class PersistenceService {
    // Save Custom Coach
    static async saveCustomCoach(coach: Coach) {
        try {
            const coaches = await this.getCustomCoaches();
            coaches.push(coach);
            console.log('💾 [WEB] Saving coach:', coach.text, 'Total coaches:', coaches.length);
            localStorage.setItem(STORAGE_KEYS.COACHES, JSON.stringify(coaches));
            console.log('✅ [WEB] Coach saved successfully to localStorage');
        } catch (e) {
            console.error('❌ [WEB] Failed to save coach', e);
        }
    }

    // Get All Custom Coaches
    static async getCustomCoaches(): Promise<Coach[]> {
        try {
            const json = localStorage.getItem(STORAGE_KEYS.COACHES);
            const result = json != null ? JSON.parse(json) : [];
            console.log('📖 [WEB] Reading coaches from localStorage:', result.length);
            return result;
        } catch (e) {
            console.error('❌ [WEB] Failed to read coaches', e);
            return [];
        }
    }

    // Save a message to a specific coach's chat history
    static async saveMessage(coachId: string, message: AIMessage) {
        try {
            const chats = await this.getAllChats();
            if (!chats[coachId]) {
                chats[coachId] = {
                    coachId,
                    messages: [],
                    lastUpdated: Date.now()
                };
            }
            chats[coachId].messages.push(message);
            chats[coachId].lastUpdated = Date.now();
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
        } catch (e) {
            console.error('[WEB] Failed to save message', e);
        }
    }

    // Get chat history for a specific coach
    static async getChatHistory(coachId: string): Promise<AIMessage[]> {
        try {
            const chats = await this.getAllChats();
            return chats[coachId]?.messages || [];
        } catch (e) {
            return [];
        }
    }

    // Get all chats
    static async getAllChats(): Promise<{ [coachId: string]: ChatSession }> {
        try {
            const json = localStorage.getItem(STORAGE_KEYS.CHATS);
            return json != null ? JSON.parse(json) : {};
        } catch (e) {
            return {};
        }
    }

    // Clear chat history for a coach
    static async clearChatHistory(coachId: string) {
        try {
            const chats = await this.getAllChats();
            delete chats[coachId];
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
        } catch (e) {
            console.error('[WEB] Failed to clear chat', e);
        }
    }

    // User Context
    static async saveUserContext(context: UserContext) {
        try {
            localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(context));
        } catch (e) {
            console.error('[WEB] Failed to save context', e);
        }
    }

    static async getUserContext(): Promise<UserContext | null> {
        try {
            const json = localStorage.getItem(STORAGE_KEYS.PREFS);
            return json != null ? JSON.parse(json) : null;
        } catch (e) {
            return null;
        }
    }
}

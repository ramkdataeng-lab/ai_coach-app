import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, View, Alert, Share, Keyboard } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Send, ArrowLeft, Lock, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RevenueCatService } from '@/utils/revenuecat';
import { PersistenceService } from '@/utils/persistence';
import RevenueCatUI from 'react-native-purchases-ui';
import { generateAIResponse, AIMessage } from '@/utils/ai-service';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

const FREE_MESSAGES_PER_COACH = 5; // 5 messages per coach (30 total across 6 coaches)

export default function ChatScreen() {
    const params = useLocalSearchParams<{ id: string, name: string }>();
    const id = params.id;
    const name = params.name;
    const colorScheme = useColorScheme();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: `Hello! I'm ${name}. How can I help you today?`, sender: 'ai', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isPro, setIsPro] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        checkProStatus();
        loadChatHistory();

        // Auto-scroll when keyboard appears
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const loadChatHistory = async () => {
        const history = await PersistenceService.getChatHistory(id);
        if (history && history.length > 0) {
            const loadedMessages: Message[] = history.map((m, index) => ({
                id: `history-${index}`,
                text: m.content,
                sender: m.role === 'user' ? 'user' : 'ai',
                timestamp: new Date() // approximate
            }));
            setMessages(loadedMessages);
            setMessageCount(loadedMessages.filter(m => m.sender === 'user').length);

            // Scroll to bottom after loading history
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 300);
        }
    };

    const checkProStatus = async () => {
        const pro = await RevenueCatService.isPro();
        setIsPro(pro);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out my AI Coach "${name}" on Nirvan! It helps me with: Focus and Clarity. Download Nirvan now!`,
            });
        } catch (error) {
            // ignore
        }
    };

    const handleSendMessage = async () => {
        const userText = inputText.trim();
        if (!userText || isSending) return;

        setIsSending(true);

        // Check limits for free users
        if (!isPro && messageCount >= FREE_MESSAGES_PER_COACH) {
            try {
                const paywallResult = await RevenueCatUI.presentPaywall({
                    displayCloseButton: true,
                });
                if (paywallResult === RevenueCatUI.PAYWALL_RESULT.PURCHASED) {
                    setIsPro(true);
                    // Just set isPro to true, user can tap send again or we can recursively call (but let's just let them tap)
                }
            } catch (e) {
                console.log("Paywall dismissed or error", e);
            }
            setIsSending(false);
            return;
        }

        const msgId = Date.now().toString() + Math.random().toString().slice(2, 5);

        // 1. Add User Message
        const userMsg: Message = {
            id: msgId,
            text: userText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setMessageCount(prev => prev + 1);

        // Auto-scroll to show the new user message
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Save User Message
        PersistenceService.saveMessage(id, { role: 'user', content: userText });

        // 2. Call AI Service
        try {
            // Convert current messages to AI history format
            const history: AIMessage[] = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            // Add the new user message (since it's not in 'messages' state yet for this render cycle usually)
            history.push({ role: 'user', content: userText });

            // Mapping ID to coach type
            const coachMap: Record<string, string> = {
                '1': 'productivity',
                '2': 'creative',
                '3': 'systems',
            };

            // Fallback to ID allows Custom Coaches (where ID is the key) to work
            const coachType = coachMap[id] || id;

            const responseText = await generateAIResponse(history, coachType);

            const aiMsgId = (Date.now() + 1).toString() + Math.random().toString().slice(2, 5);
            const aiMsg: Message = {
                id: aiMsgId,
                text: responseText,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);

            // Auto-scroll to show the AI response
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);

            // Save AI Message
            PersistenceService.saveMessage(id, { role: 'assistant', content: responseText });

        } catch (error: any) {
            if (error.message === 'SUBSCRIPTION_REQUIRED') {
                try {
                    const paywallResult = await RevenueCatUI.presentPaywall({
                        displayCloseButton: true,
                    });
                    if (paywallResult === RevenueCatUI.PAYWALL_RESULT.PURCHASED) {
                        setIsPro(true);
                        const systemMsg: Message = {
                            id: Date.now().toString(),
                            text: "Thanks for upgrading! Please resend your message.",
                            sender: 'ai',
                            timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, systemMsg]);
                    }
                } catch (e) {
                    // Paywall dismissed
                }
            } else {
                console.error("Chat Error", error);
                const errorMsg: Message = {
                    id: Date.now().toString(),
                    text: error.message || "I'm having trouble connecting to the server.",
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMsg]);
            }
        } finally {
            setIsSending(false);
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.aiBubble,
                { backgroundColor: isUser ? Colors.light.tint : '#e2e8f0' } // Light mode bubble colors
            ]}>
                <ThemedText style={[styles.messageText, isUser && { color: '#fff' }]}>{item.text}</ThemedText>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <ThemedText type="subtitle" style={styles.headerTitle}>{name}</ThemedText>

                    {/* Share Button */}
                    <TouchableOpacity onPress={handleShare} style={{ marginRight: 16 }}>
                        <Share2 size={24} color={Colors.light.tint} />
                    </TouchableOpacity>

                    {!isPro && (
                        <View style={styles.limitContainer}>
                            <ThemedText style={styles.limitText}>{FREE_MESSAGES_PER_COACH - messageCount} left</ThemedText>
                        </View>
                    )}
                </ThemedView>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: '#f1f5f9',
                                color: Colors.light.text
                            }]}
                            placeholder={!isPro && messageCount >= FREE_MESSAGES_PER_COACH ? "Upgrade to continue..." : "Type a message..."}
                            placeholderTextColor="#94a3b8"
                            value={inputText}
                            onChangeText={setInputText}
                            onKeyPress={(e: any) => {
                                // Handle Enter key on web
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            multiline
                            editable={isPro || messageCount < FREE_MESSAGES_PER_COACH}
                        />
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            style={[styles.sendButton, { backgroundColor: Colors.light.tint, opacity: isSending ? 0.5 : 1 }]}
                            disabled={isSending}
                        >
                            {!isPro && messageCount >= FREE_MESSAGES_PER_COACH ? (
                                <Lock size={20} color="#fff" />
                            ) : (
                                <Send size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTitle: {
        fontFamily: 'Outfit_600SemiBold',
        flex: 1,
    },
    limitContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    limitText: {
        fontSize: 12,
        opacity: 0.7,
        fontFamily: 'Inter_500Medium',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    userBubble: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        flex: 1,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 12,
        fontFamily: 'Inter_400Regular',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

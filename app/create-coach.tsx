import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, ScrollView, Platform, KeyboardAvoidingView, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Save, Sparkles } from 'lucide-react-native';
import { PersistenceService, Coach } from '@/utils/persistence';
import { generateSystemPrompt } from '@/utils/ai-service';

import { CoachIcon } from '@/components/coach-icon';

export default function CreateCoachScreen() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [prompt, setPrompt] = useState('You are a helpful AI coach.');
    const [icon, setIcon] = useState('Sparkles');
    const [isPromptTouched, setIsPromptTouched] = useState(false);
    const [isDescTouched, setIsDescTouched] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Auto-draft the system prompt with AI (Debounced)
    React.useEffect(() => {
        // Run if name is present AND we have something to auto-fill (prompt untouched OR desc untouched & empty)
        const shouldGenerate = name.length > 2 && (!isPromptTouched || (!isDescTouched && !desc));

        if (shouldGenerate) {
            const timer = setTimeout(async () => {
                setIsGenerating(true);
                try {
                    console.log('✨ Generating system prompt for:', name);
                    const aiResult = await generateSystemPrompt(name, desc);

                    console.log('✨ AI Result:', aiResult);

                    if (aiResult.icon) {
                        setIcon(aiResult.icon);
                    }

                    if (!isPromptTouched) {
                        const promptVal = aiResult.prompt && typeof aiResult.prompt === 'object'
                            ? JSON.stringify(aiResult.prompt)
                            : String(aiResult.prompt || '');
                        setPrompt(promptVal);
                    }
                    if (!isDescTouched && !desc) {
                        const descVal = aiResult.description && typeof aiResult.description === 'object'
                            ? JSON.stringify(aiResult.description)
                            : String(aiResult.description || '');
                        setDesc(descVal);
                    }
                } catch (error) {
                    console.error('Failed to generate prompt:', error);
                } finally {
                    setIsGenerating(false);
                }
            }, 1500); // 1.5s debounce

            return () => clearTimeout(timer);
        }
    }, [name, isPromptTouched, isDescTouched]);

    const handleSave = async () => {
        console.log('🎯 Save button clicked');

        if (!name.trim() || !desc.trim() || !prompt.trim()) {
            console.log('❌ Missing fields');
            // Alert removed
            return;
        }

        const newCoach: Coach = {
            id: 'custom_' + Date.now(),
            text: name,
            subtitle: desc,
            icon: icon,
            systemPrompt: prompt,
            isCustom: true
        };

        console.log('💾 Attempting to save coach:', newCoach);
        await PersistenceService.saveCustomCoach(newCoach);
        console.log('✅ Navigating back to home');
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.header}>
                    <ArrowLeft
                        size={24}
                        color={Colors.light.text}
                        onPress={() => router.back()}
                        style={{ marginRight: 16 }}
                    />
                    <ThemedText type="title" style={styles.title}>Craft Your Coach</ThemedText>
                    <View style={{
                        marginLeft: 'auto',
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                        elevation: 5
                    }}>
                        {isGenerating ? (
                            <ActivityIndicator size="small" color={Colors.light.tint} />
                        ) : (
                            <CoachIcon name={icon} size={28} />
                        )}
                    </View>
                </ThemedView>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <ThemedText style={styles.label}>Coach Identity</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Minimalist Chef"
                            placeholderTextColor="#9ca3af"
                            value={name}
                            onChangeText={setName}
                        />

                        <ThemedText style={styles.label}>
                            Short Description
                            {isGenerating && !isDescTouched && !desc && <ThemedText style={{ fontSize: 12, color: '#f97316' }}> ✨ Drafting...</ThemedText>}
                        </ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="Helps me cook with few ingredients..."
                            placeholderTextColor="#9ca3af"
                            value={desc}
                            onChangeText={(text) => {
                                setIsDescTouched(true);
                                setDesc(text);
                            }}
                        />

                        <ThemedText style={styles.label}>
                            System Instruction (Prompt)
                            {isGenerating && !isPromptTouched && <ThemedText style={{ fontSize: 12, color: '#f97316' }}> ✨ Drafting...</ThemedText>}
                        </ThemedText>
                        <ThemedText style={styles.hint}>
                            Define how the AI should behave. Be specific about tone and expertise.
                        </ThemedText>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="You are a minimalist chef. You suggest recipes with max 5 ingredients..."
                            placeholderTextColor="#9ca3af"
                            value={prompt}
                            onChangeText={(text) => {
                                setIsPromptTouched(true);
                                setPrompt(text);
                            }}
                            multiline
                            textAlignVertical="top"
                        />

                        <ThemedView style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
                                <ThemedText style={styles.saveButtonText}>Craft Coach</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ScrollView>
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
        padding: 24,
        paddingBottom: 12,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
    },
    scrollContent: {
        padding: 24,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        marginBottom: 8,
        marginTop: 16,
    },
    hint: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
        fontFamily: 'Inter_400Regular',
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    textArea: {
        height: 150,
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    saveButton: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: Colors.light.tint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
    },
});

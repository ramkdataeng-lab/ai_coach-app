
import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { PersistenceService } from '@/utils/persistence';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function UserContextScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [values, setValues] = useState('');
    const [focus, setFocus] = useState('');

    // Load saved context when screen opens
    useEffect(() => {
        loadSavedContext();
    }, []);

    const loadSavedContext = async () => {
        const savedContext = await PersistenceService.getUserContext();
        if (savedContext) {
            setName(savedContext.name || '');
            setValues(savedContext.values || '');
            setFocus(savedContext.focus || '');
        }
    };

    const handleSave = async () => {
        // Save context even if empty (allows user to skip)
        // We save to ensure the check in HomeScreen passes and doesn't redirect back here
        await PersistenceService.saveUserContext({
            name: name.trim() || 'Guest',
            values: values.trim(),
            focus: focus.trim(),
        });

        // Navigate to tabs
        router.replace('/(tabs)');
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                {/* Custom Header with Back Button */}
                <View style={styles.customHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>context</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <ThemedText style={styles.title}>Set Your Intention</ThemedText>
                            <ThemedText style={styles.subtitle}>
                                "Maybe there's a space to add your personal context and your values, then you just pick the coach, chat with it, and you get somewhere."
                            </ThemedText>
                        </View>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>What should I call you?</ThemedText>
                            <TextInput
                                style={[styles.input, { minHeight: 50 }]} // Shorter input for name
                                placeholder="Your Name"
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor={Colors.light.icon}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>What do you value most right now?</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Clarity, Speed, Sustainability, Peace..."
                                value={values}
                                onChangeText={setValues}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor={Colors.light.icon}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <ThemedText style={styles.label}>What is your main focus?</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Launching a product, Finding purpose..."
                                value={focus}
                                onChangeText={setFocus}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor={Colors.light.icon}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <ThemedText style={styles.buttonText}>Begin Journey</ThemedText>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    safeArea: {
        flex: 1,
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 8,
        width: 40,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        color: Colors.light.text,
    },
    content: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
        color: Colors.light.text,
        lineHeight: 40, // Increased line height to prevent clipping
        paddingVertical: 4, // Extra padding for safety
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: Colors.light.icon,
        fontStyle: 'italic',
        lineHeight: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        marginBottom: 8,
        color: Colors.light.text,
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
    },
    input: {
        backgroundColor: Colors.light.card,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: Colors.light.text,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    button: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: Colors.light.tint, // Indigo shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
    },
});

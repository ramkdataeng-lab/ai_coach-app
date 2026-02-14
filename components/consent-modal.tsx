import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, Linking, Platform, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/Colors';
import { PersistenceService } from '@/utils/persistence';
import { ShieldCheck, Server, Lock } from 'lucide-react-native';

interface ConsentModalProps {
    onConsent?: () => void;
}

export function ConsentModal({ onConsent }: ConsentModalProps) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkConsent();
    }, []);

    const checkConsent = async () => {
        const hasConsented = await PersistenceService.getAIConsent();
        if (!hasConsented) {
            setVisible(true);
        }
        setLoading(false);
    };

    const handleAccept = async () => {
        await PersistenceService.setAIConsent(true);
        setVisible(false);
        if (onConsent) onConsent();
    };

    const openPrivacyPolicy = () => {
        // Link to the privacy policy hosted or within the app
        Linking.openURL('https://nirvan-ai-coach-v2.vercel.app/Nirvan-ai/PRIVACY_POLICY.html'); // Update with actual URL if known, or local file
    };

    if (loading && !visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => { }} // Prevent closing on Android back button without consent
        >
            <View style={styles.overlay}>
                <ThemedView style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.iconContainer}>
                            <ShieldCheck size={48} color={Colors.light.tint} />
                        </View>

                        <ThemedText type="title" style={styles.title}>Data Privacy & AI</ThemedText>

                        <ThemedText style={styles.description}>
                            Nirvan AI uses advanced artificial intelligence to provide personalized coaching.
                            To enable this, we need your permission to process your data.
                        </ThemedText>

                        <View style={styles.infoBox}>
                            <View style={styles.infoRow}>
                                <Server size={20} color="#64748b" style={styles.infoIcon} />
                                <ThemedText style={styles.infoText}>
                                    Your messages and context are sent to <ThemedText type="defaultSemiBold">OpenAI</ThemedText> for processing.
                                </ThemedText>
                            </View>

                            <View style={styles.infoRow}>
                                <Lock size={20} color="#64748b" style={styles.infoIcon} />
                                <ThemedText style={styles.infoText}>
                                    We do <ThemedText type="defaultSemiBold">not</ThemedText> store your conversations on our servers. Your data remains private.
                                </ThemedText>
                            </View>
                        </View>

                        <ThemedText style={styles.description}>
                            By continuing, you agree to our Privacy Policy and consent to sharing your input with OpenAI depending on your interaction.
                        </ThemedText>

                        <TouchableOpacity onPress={openPrivacyPolicy} style={styles.linkButton}>
                            <ThemedText style={styles.linkText}>Read Privacy Policy</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                            <ThemedText style={styles.acceptButtonText}>I Agree & Continue</ThemedText>
                        </TouchableOpacity>
                    </ScrollView>
                </ThemedView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        backgroundColor: '#fff', // Or themed background
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        maxHeight: '90%',
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#F0F9FF',
        borderRadius: 50,
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 24,
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#64748b',
        lineHeight: 22,
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
    },
    linkButton: {
        marginBottom: 24,
        padding: 8,
    },
    linkText: {
        color: Colors.light.tint,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    acceptButton: {
        width: '100%',
        backgroundColor: Colors.light.tint,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: Colors.light.tint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Outfit_600SemiBold',
    }
});

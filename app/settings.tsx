import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, Platform, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Moon, Bell, Smartphone, Trash2, FileText, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PersistenceService } from '@/utils/persistence';
import { AppHeader } from '@/components/app-header';

export default function SettingsScreen() {
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleClearData = () => {
        Alert.alert(
            "Clear All Data",
            "Are you sure you want to delete all custom coaches and chat history? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await PersistenceService.clearAllData();
                        Alert.alert("Success", "All data has been reset.", [
                            { text: "OK", onPress: () => router.replace('/(tabs)') }
                        ]);
                    }
                }
            ]
        );
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>

                <AppHeader
                    title="App Settings"
                    showBack={true}
                    style={{ paddingHorizontal: 24, paddingTop: 12, marginBottom: 24 }}
                />

                <ScrollView contentContainerStyle={styles.content}>

                    {/* Preferences */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

                        <View style={styles.row}>
                            <View style={styles.rowIcon}>
                                <Bell size={20} color={Colors.light.text} />
                            </View>
                            <ThemedText style={styles.rowText}>Notifications</ThemedText>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#e2e8f0', true: Colors.light.tint }}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.rowIcon}>
                                <Smartphone size={20} color={Colors.light.text} />
                            </View>
                            <ThemedText style={styles.rowText}>Haptic Feedback</ThemedText>
                            <Switch
                                value={hapticsEnabled}
                                onValueChange={setHapticsEnabled}
                                trackColor={{ false: '#e2e8f0', true: Colors.light.tint }}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.rowIcon}>
                                <Moon size={20} color={Colors.light.text} />
                            </View>
                            <ThemedText style={styles.rowText}>Dark Mode</ThemedText>
                            <Switch
                                value={darkMode}
                                onValueChange={(val) => {
                                    setDarkMode(val);
                                    Alert.alert("Coming Soon", "Dark mode is currently under development.");
                                }}
                                trackColor={{ false: '#e2e8f0', true: Colors.light.tint }}
                            />
                        </View>
                    </ThemedView>

                    {/* Support */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Support</ThemedText>

                        <TouchableOpacity style={styles.linkRow}>
                            <FileText size={20} color={Colors.light.text} />
                            <ThemedText style={styles.linkText}>Privacy Policy</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkRow}>
                            <Info size={20} color={Colors.light.text} />
                            <ThemedText style={styles.linkText}>Terms of Service</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Danger Zone */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={[styles.sectionTitle, { color: '#ef4444' }]}>Danger Zone</ThemedText>

                        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
                            <Trash2 size={20} color="#ef4444" />
                            <ThemedText style={styles.dangerText}>Clear All Data</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedText style={styles.version}>v1.0.0 (Build 1)</ThemedText>

                </ScrollView>
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
    // header styles REMOVED
    content: {
        padding: 24,
        paddingTop: 0,
    },
    section: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#94a3b8',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    rowIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rowText: {
        flex: 1,
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    linkText: {
        marginLeft: 16,
        fontFamily: 'Inter_500Medium',
        fontSize: 16,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    dangerText: {
        marginLeft: 8,
        color: '#ef4444',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
    },
    version: {
        textAlign: 'center',
        color: '#cbd5e1',
        fontSize: 12,
        marginTop: 24,
        marginBottom: 40,
        fontFamily: 'Inter_400Regular',
    }
});

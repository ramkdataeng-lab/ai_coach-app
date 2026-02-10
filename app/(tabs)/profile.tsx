import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut, Award, CheckCircle, User } from 'lucide-react-native';
import { RevenueCatService, ENTITLEMENT_ID } from '@/utils/revenuecat';
import Purchases from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AppHeader } from '@/components/app-header';

export default function ProfileScreen() {
    const isDev = Constants.executionEnvironment === 'storeClient';
    const version = Constants.expoConfig?.version || '1.0.0';
    const build = Constants.expoConfig?.ios?.buildNumber || '1';

    const colorScheme = useColorScheme();
    const [isPro, setIsPro] = useState(false);
    const textColor = useThemeColor({}, 'text');

    useEffect(() => {
        checkProStatus();

        // Debug: Check if RevenueCat is connected
        RevenueCatService.getOfferings().then(offerings => {
            if (offerings) {
                console.log("✅ RevenueCat Connected! Loaded Offerings:", offerings);
            } else {
                console.log("⚠️ RevenueCat Connected but NO Offerings found. Check Dashboard Config.");
            }
        }).catch(e => console.error("❌ RevenueCat Connection Failed:", e));

        try {
            // Listen for customer info updates (e.g., after purchase)
            Purchases.addCustomerInfoUpdateListener((info) => {
                const active = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
                setIsPro(active);
            });
        } catch (error) {
            console.warn("RevenueCat listener failed (SDK not likely initialized):", error);
        }

        return () => {
            try {
                Purchases.removeCustomerInfoUpdateListener(() => { });
            } catch (e) {
                // Ignore cleanup errors
            }
        };
    }, []);

    const checkProStatus = async () => {
        const pro = await RevenueCatService.isPro();
        setIsPro(pro);
    };

    const handleUpgrade = async () => {
        try {
            // Present the Paywall
            const paywallResult = await RevenueCatUI.presentPaywall({
                displayCloseButton: true,
            });

            if (paywallResult === RevenueCatUI.PAYWALL_RESULT.PURCHASED) {
                setIsPro(true);
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Could not load paywall");
        }
    };

    const handleRestore = async () => {
        try {
            const { success, error } = await RevenueCatService.restorePurchases();
            if (success) {
                await checkProStatus();
                Alert.alert("Success", "Purchases restored!");
            } else {
                Alert.alert("Error", error || "Could not restore purchases");
            }
        } catch (e) {
            Alert.alert("Error", "An unexpected error occurred");
        }
    }

    const [debugTaps, setDebugTaps] = useState(0);

    const handleDebugTap = () => {
        const newCount = debugTaps + 1;
        console.log(`🔍 Debug tap: ${newCount}/5`);
        setDebugTaps(newCount);

        if (newCount === 5 && isDev) {
            console.log('✅ Unlocking Pro features!');
            RevenueCatService.setMockPro(true);
            setIsPro(true);
            Alert.alert("🎉 Debug Mode", "Pro Features Unlocked for Demo!\n\nYou now have unlimited messages.");
            setDebugTaps(0); // Reset counter
        } else if (newCount >= 3 && isDev) {
            // Visual feedback when close
            console.log(`💡 ${5 - newCount} more taps to unlock Pro`);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.header}>
                    <AppHeader>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleDebugTap}
                                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            >
                                <ThemedText type="title" style={{ fontFamily: 'Outfit_700Bold' }}>Profile</ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={styles.subtitle}>Manage your membership and settings.</ThemedText>
                        </View>
                    </AppHeader>
                </ThemedView>

                <ThemedView style={[styles.membershipCard, isPro && styles.proCard]}>
                    <Award size={32} color={isPro ? "#ffd700" : "#fff"} />
                    <ThemedText style={styles.membershipTitle} type="subtitle">
                        {isPro ? "Pro Member" : "Free Plan"}
                    </ThemedText>
                    <ThemedText style={styles.membershipDesc}>
                        {isPro
                            ? "You have unlocked all coaches and priority support."
                            : "Upgrade to access unlimited coaches and advanced AI models."}
                    </ThemedText>

                    {!isPro && (
                        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                            <ThemedText style={styles.upgradeText}>Upgrade to Pro</ThemedText>
                        </TouchableOpacity>
                    )}
                </ThemedView>

                <ThemedView style={styles.section}>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/context')}>
                        <User size={24} color={Colors.light.icon} />
                        <ThemedText style={styles.rowText}>Edit Personal Context</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={handleRestore}>
                        <CheckCircle size={24} color={Colors.light.icon} />
                        <ThemedText style={styles.rowText}>Restore Purchases</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/settings')}>
                        <Settings size={24} color={Colors.light.icon} />
                        <ThemedText style={styles.rowText}>App Settings</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <LogOut size={24} color={Colors.light.icon} />
                        <ThemedText style={styles.rowText}>Log Out</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                <ThemedView style={styles.footer}>
                    <ThemedText style={styles.versionText}>
                        {isDev ? 'Development Mode (Expo Go)' : 'Production Mode'}
                    </ThemedText>
                    <ThemedText style={styles.versionText}>
                        v{version} (Build {build})
                    </ThemedText>
                </ThemedView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    subtitle: {
        opacity: 0.6,
        marginTop: 8,
        fontFamily: 'Inter_400Regular',
    },
    membershipCard: {
        backgroundColor: '#f97316', // Warm orange
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
    },
    proCard: {
        backgroundColor: '#ea580c', // Darker orange for Pro
        borderWidth: 1,
        borderColor: '#ffd700', // Gold border for Pro
    },
    membershipTitle: {
        color: '#fff',
        marginTop: 12,
        fontFamily: 'Outfit_600SemiBold',
    },
    membershipDesc: {
        color: '#fed7aa', // Warm orange tint for description
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
        fontFamily: 'Inter_400Regular',
    },
    upgradeButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    upgradeText: {
        color: '#f97316', // Orange text
        fontFamily: 'Outfit_600SemiBold',
    },
    section: {
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    rowText: {
        marginLeft: 16,
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        opacity: 0.5,
        backgroundColor: 'transparent',
    },
    versionText: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    }
});

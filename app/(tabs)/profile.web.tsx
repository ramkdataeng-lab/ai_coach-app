import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Image, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut, Award, CheckCircle, User } from 'lucide-react-native';
import { RevenueCatService } from '@/utils/revenuecat'; // Picking up .web.ts
import { router } from 'expo-router';
import Constants from 'expo-constants';

export default function ProfileScreen() {
    const isDev = __DEV__;
    const version = Constants.expoConfig?.version || '1.0.0';
    const build = 'web';

    const colorScheme = useColorScheme();
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        checkProStatus();
    }, []);

    const checkProStatus = async () => {
        const pro = await RevenueCatService.isPro();
        setIsPro(pro);
    };

    const handleUpgrade = async () => {
        Alert.alert("Web Platform", "In-App Purchases are not supported on the web. Please use the mobile app.");
    };

    const handleRestore = async () => {
        Alert.alert("Web Platform", "Restore Purchases is not supported on the web.");
    }

    const [debugTaps, setDebugTaps] = useState(0);

    const handleDebugTap = () => {
        const newCount = debugTaps + 1;
        setDebugTaps(newCount);

        if (newCount === 5 && isDev) {
            console.log('✅ Unlocking Pro features (Web)!');
            RevenueCatService.setMockPro(true);
            setIsPro(true);
            Alert.alert("🎉 Debug Mode", "Pro Features Unlocked for Demo (Web)!");
            setDebugTaps(0);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ThemedView style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleDebugTap}
                            >
                                <ThemedText type="title" style={{ fontFamily: 'Outfit_700Bold' }}>Profile</ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={styles.subtitle}>Manage your membership and settings.</ThemedText>
                        </View>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('@/assets/images/Final_Logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
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
                    <TouchableOpacity style={styles.row}>
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
                        Web Version
                    </ThemedText>
                    <ThemedText style={styles.versionText}>
                        v{version}
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
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoContainer: {
        marginLeft: 16,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    logoImage: {
        width: 48,
        height: 48,
        borderRadius: 10,
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

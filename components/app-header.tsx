import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    logoSize?: number;
    children?: React.ReactNode; // For custom left content (like "Good Morning")
    rightElement?: React.ReactNode; // For extra right content (like a save button) alongside logo
    style?: ViewStyle;
}

export function AppHeader({
    title,
    subtitle,
    showBack = false,
    logoSize = 80,
    children,
    rightElement,
    style
}: AppHeaderProps) {

    return (
        <View style={[styles.container, style]}>
            {/* Top Row: Navigation/Content and Logo */}
            <View style={styles.headerRow}>
                {/* Left Content */}
                <View style={styles.leftContainer}>
                    {showBack && (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ArrowLeft size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    )}

                    {children ? (
                        children
                    ) : (
                        <View>
                            {title && <ThemedText type="title" style={styles.title}>{title}</ThemedText>}
                            {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
                        </View>
                    )}
                </View>

                {/* Right Content (Logo + Extras) */}
                <View style={styles.rightContainer}>
                    {rightElement && <View style={styles.rightElement}>{rightElement}</View>}

                    <View style={[styles.logoContainer, { borderRadius: logoSize * 0.3 }]}>
                        <Image
                            source={require('@/assets/images/Final_Logo.png')}
                            style={{ width: logoSize, height: logoSize, borderRadius: logoSize * 0.2 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>

            {/* Tagline below logo/header */}
            <View style={styles.taglineContainer}>
                <ThemedText style={styles.tagline}>
                    "The right guidance at the right moment can change everything."
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16, // Space before logo
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
    },
    subtitle: {
        opacity: 0.6,
        marginTop: 4,
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    },
    logoContainer: {
        padding: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
        marginLeft: 8,
    },
    rightElement: {
        marginRight: 8,
    },
    taglineContainer: {
        paddingTop: 0,
        paddingBottom: 8,
        paddingHorizontal: 4,
    },
    tagline: {
        fontStyle: 'italic',
        fontSize: 15,
        color: '#f97316', // Brand Orange
        fontFamily: 'Outfit_600SemiBold',
        opacity: 1, // Remove opacity for vibrant color
        lineHeight: 22,
        // Optional: textAlign depends on preference. Left aligned usually better for tagline under header.
    }
});

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/Colors';
import { ChevronRight } from 'lucide-react-native';

export type CoachProps = {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    onPress: () => void;
};

export function CoachCard({ name, description, icon, onPress }: CoachProps) {
    const theme = useColorScheme() ?? 'light';

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <ThemedView style={[styles.card, { borderColor: Colors[theme].border }]}>
                <ThemedView style={styles.content}>
                    <ThemedView style={[styles.iconContainer, { backgroundColor: Colors[theme].tint + '20' }]}>
                        {icon}
                    </ThemedView>
                    <ThemedView style={styles.textContainer}>
                        <ThemedText type="defaultSemiBold" style={styles.name}>{name}</ThemedText>
                        <ThemedText type="default" style={styles.description} numberOfLines={2}>
                            {description}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
                <ChevronRight size={20} color={Colors[theme].icon} />
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        marginBottom: 4,
        fontFamily: 'Outfit_600SemiBold',
    },
    description: {
        fontSize: 14,
        opacity: 0.7,
        fontFamily: 'Inter_400Regular',
    },
});

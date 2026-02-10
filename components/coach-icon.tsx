import React from 'react';
import {
    Sparkles, Dumbbell, Trophy, Medal,
    Palette, Music, Camera,
    Code, Cpu, Globe,
    Heart, Sun, Coffee, Leaf, BookOpen,
    BrainCircuit, Zap, Lightbulb, Compass, Anchor, Briefcase, GraduationCap, Gavel, Stethoscope
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const ICON_MAP: Record<string, any> = {
    Dumbbell, Trophy, Medal,
    Palette, Music, Camera,
    Code, Cpu, Globe,
    Heart, Sun, Coffee, Leaf, BookOpen,
    BrainCircuit, Zap, Lightbulb, Compass, Anchor, Briefcase, GraduationCap, Gavel, Stethoscope,
    Sparkles // Default
};

interface CoachIconProps {
    name: string;
    size?: number;
    color?: string;
}

export function CoachIcon({ name, size = 24, color }: CoachIconProps) {
    // Normalize name (case insensitive)
    const key = Object.keys(ICON_MAP).find(k => k.toLowerCase() === name.toLowerCase()) || 'Sparkles';
    const IconComponent = ICON_MAP[key];

    return <IconComponent size={size} color={color || Colors.light.tint} />;
}

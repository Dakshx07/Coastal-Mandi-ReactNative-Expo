import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Ellipse, G } from 'react-native-svg';

// Fish avatar colors - ocean themed
const FISH_PALETTES = [
    { body: '#3b82f6', accent: '#60a5fa', eye: '#1e40af' }, // Blue
    { body: '#22c55e', accent: '#4ade80', eye: '#166534' }, // Green
    { body: '#f97316', accent: '#fb923c', eye: '#c2410c' }, // Orange
    { body: '#a855f7', accent: '#c084fc', eye: '#7e22ce' }, // Purple
    { body: '#ef4444', accent: '#f87171', eye: '#b91c1c' }, // Red
    { body: '#14b8a6', accent: '#2dd4bf', eye: '#0d9488' }, // Teal
    { body: '#eab308', accent: '#facc15', eye: '#a16207' }, // Yellow
    { body: '#ec4899', accent: '#f472b6', eye: '#be185d' }, // Pink
];

const FISH_SHAPES = ['round', 'long', 'fancy', 'puffer'];

interface FishAvatarProps {
    seed?: string;
    size?: number;
}

// Generate consistent index from seed
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export default function FishAvatar({ seed = 'user', size = 40 }: FishAvatarProps) {
    const hash = hashCode(seed);
    const palette = FISH_PALETTES[hash % FISH_PALETTES.length];
    const shapeIndex = hash % FISH_SHAPES.length;

    const scale = size / 40;

    const renderFish = () => {
        switch (shapeIndex) {
            case 0: // Round fish
                return (
                    <G transform={`scale(${scale})`}>
                        {/* Body */}
                        <Ellipse cx="20" cy="20" rx="14" ry="12" fill={palette.body} />
                        {/* Tail */}
                        <Path d="M6 20 L0 12 L0 28 Z" fill={palette.accent} />
                        {/* Fin */}
                        <Path d="M20 8 L18 15 L24 12 Z" fill={palette.accent} />
                        {/* Eye */}
                        <Circle cx="26" cy="18" r="4" fill="white" />
                        <Circle cx="27" cy="18" r="2" fill={palette.eye} />
                        {/* Mouth */}
                        <Path d="M32 22 Q 35 20 32 18" stroke={palette.eye} strokeWidth="1.5" fill="none" />
                    </G>
                );
            case 1: // Long fish
                return (
                    <G transform={`scale(${scale})`}>
                        {/* Body */}
                        <Ellipse cx="20" cy="20" rx="16" ry="8" fill={palette.body} />
                        {/* Tail */}
                        <Path d="M4 20 L0 14 L0 26 Z" fill={palette.accent} />
                        {/* Dorsal fin */}
                        <Path d="M12 12 L20 12 L18 18" fill={palette.accent} />
                        {/* Eye */}
                        <Circle cx="30" cy="18" r="3" fill="white" />
                        <Circle cx="31" cy="18" r="1.5" fill={palette.eye} />
                        {/* Stripes */}
                        <Path d="M15 14 L15 26" stroke={palette.accent} strokeWidth="2" />
                        <Path d="M22 14 L22 26" stroke={palette.accent} strokeWidth="2" />
                    </G>
                );
            case 2: // Fancy fish (like angelfish)
                return (
                    <G transform={`scale(${scale})`}>
                        {/* Body */}
                        <Ellipse cx="20" cy="20" rx="10" ry="12" fill={palette.body} />
                        {/* Top fin */}
                        <Path d="M20 8 L14 4 L16 14" fill={palette.accent} />
                        {/* Bottom fin */}
                        <Path d="M20 32 L14 36 L16 26" fill={palette.accent} />
                        {/* Tail */}
                        <Path d="M10 20 L4 10 L4 30 Z" fill={palette.accent} />
                        {/* Eye */}
                        <Circle cx="24" cy="18" r="3.5" fill="white" />
                        <Circle cx="25" cy="18" r="2" fill={palette.eye} />
                        {/* Pattern */}
                        <Path d="M18 14 Q 14 20 18 26" stroke={palette.accent} strokeWidth="2" fill="none" />
                    </G>
                );
            case 3: // Puffer fish
                return (
                    <G transform={`scale(${scale})`}>
                        {/* Body */}
                        <Circle cx="20" cy="20" r="14" fill={palette.body} />
                        {/* Tail */}
                        <Path d="M6 20 L2 14 L2 26 Z" fill={palette.accent} />
                        {/* Eye */}
                        <Circle cx="24" cy="16" r="4" fill="white" />
                        <Circle cx="25" cy="16" r="2.5" fill={palette.eye} />
                        {/* Spots */}
                        <Circle cx="16" cy="14" r="2" fill={palette.accent} />
                        <Circle cx="14" cy="22" r="2" fill={palette.accent} />
                        <Circle cx="20" cy="28" r="2" fill={palette.accent} />
                        {/* Mouth */}
                        <Circle cx="32" cy="22" r="2" fill={palette.accent} />
                    </G>
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {renderFish()}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: '#0f172a',
    },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';

// Person avatar colors - professional themed
const AVATAR_PALETTES = [
    { skin: '#f5d0c5', hair: '#2d1810', shirt: '#3b82f6' }, // Light skin, dark hair, blue
    { skin: '#d4a574', hair: '#1a1a1a', shirt: '#22c55e' }, // Medium skin, black hair, green
    { skin: '#c4a484', hair: '#4a3728', shirt: '#8b5cf6' }, // Tan skin, brown hair, purple
    { skin: '#8d5524', hair: '#1a1a1a', shirt: '#f97316' }, // Dark skin, black hair, orange
    { skin: '#f5d0c5', hair: '#b5651d', shirt: '#ef4444' }, // Light skin, ginger hair, red
    { skin: '#e8beac', hair: '#3d2314', shirt: '#0ea5e9' }, // Medium skin, dark brown, cyan
    { skin: '#d2a679', hair: '#000000', shirt: '#eab308' }, // Olive skin, black hair, yellow
    { skin: '#a16e4b', hair: '#1a1a1a', shirt: '#ec4899' }, // Brown skin, black hair, pink
];

interface PersonAvatarProps {
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

export default function PersonAvatar({ seed = 'user', size = 40 }: PersonAvatarProps) {
    const hash = hashCode(seed);
    const palette = AVATAR_PALETTES[hash % AVATAR_PALETTES.length];

    // Feature toggles based on seed
    const hasGlasses = hash % 3 === 0;
    const hasBeard = hash % 5 === 0;
    const hasEarrings = hash % 7 === 0;
    const hairStyle = hash % 3; // 0: Short, 1: Spiky, 2: Long

    // Scale features based on size
    const strokeWidth = size / 40;

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Svg width={size} height={size} viewBox="0 0 40 40">
                <Defs>
                    <LinearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#1e293b" />
                        <Stop offset="1" stopColor="#0f172a" />
                    </LinearGradient>
                </Defs>

                {/* Background */}
                <Circle cx="20" cy="20" r="20" fill="url(#bgGrad)" />

                {/* Neck */}
                <Rect x="15" y="28" width="10" height="6" fill={palette.skin} />

                {/* Shoulders/Shirt */}
                <Path
                    d="M8 40 Q8 32 15 32 L25 32 Q32 32 32 40"
                    fill={palette.shirt}
                />

                {/* Head */}
                <Ellipse cx="20" cy="18" rx="10" ry="11" fill={palette.skin} />

                {/* Facial Hair (Beard) */}
                {hasBeard && (
                    <Path
                        d="M12 22 Q20 32 28 22 L28 20 Q20 28 12 20 Z"
                        fill={palette.hair}
                        opacity={0.8}
                    />
                )}

                {/* Hair Styles */}
                {hairStyle === 0 && ( // Standard
                    <Path
                        d="M10 18 Q10 8 20 8 Q30 8 30 18 Q30 12 20 11 Q10 12 10 18"
                        fill={palette.hair}
                    />
                )}
                {hairStyle === 1 && ( // Spiky
                    <Path
                        d="M10 18 L12 10 L16 6 L20 8 L24 6 L28 10 L30 18 Q30 12 20 11 Q10 12 10 18"
                        fill={palette.hair}
                    />
                )}
                {hairStyle === 2 && ( // Long/Bun
                    <Path
                        d="M10 18 Q8 6 20 6 Q32 6 30 18 L32 28 Q32 32 20 32 Q8 32 8 28 Z"
                        fill={palette.hair}
                    />
                )}

                {/* Eyes */}
                <Ellipse cx="16" cy="18" rx="2" ry="2" fill="white" />
                <Ellipse cx="24" cy="18" rx="2" ry="2" fill="white" />
                <Circle cx="16" cy="18" r="1" fill="#1e293b" />
                <Circle cx="24" cy="18" r="1" fill="#1e293b" />

                {/* Glasses (optional) */}
                {hasGlasses && (
                    <G>
                        <Circle cx="16" cy="18" r="3.5" fill="none" stroke="#475569" strokeWidth={0.8} />
                        <Circle cx="24" cy="18" r="3.5" fill="none" stroke="#475569" strokeWidth={0.8} />
                        <Path d="M19.5 18 L20.5 18" stroke="#475569" strokeWidth={0.8} />
                        <Path d="M12.5 18 L10 17" stroke="#475569" strokeWidth={0.8} />
                        <Path d="M27.5 18 L30 17" stroke="#475569" strokeWidth={0.8} />
                    </G>
                )}

                {/* Smile */}
                <Path
                    d="M17 24 Q20 27 23 24"
                    fill="none"
                    stroke={palette.hair}
                    strokeWidth={1}
                    strokeLinecap="round"
                    opacity={0.6}
                />

                {/* Ears & Earnings */}
                <Ellipse cx="10" cy="19" rx="1.5" ry="2.5" fill={palette.skin} />
                <Ellipse cx="30" cy="19" rx="1.5" ry="2.5" fill={palette.skin} />

                {hasEarrings && (
                    <>
                        <Circle cx="10" cy="21" r="1" fill="#fbbf24" />
                        <Circle cx="30" cy="21" r="1" fill="#fbbf24" />
                    </>
                )}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#0f172a',
    },
});

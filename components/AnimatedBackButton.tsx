import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface AnimatedBackButtonProps {
    onPress?: () => void;
    color?: string;
    size?: number;
}

export default function AnimatedBackButton({
    onPress,
    color = 'white',
    size = 24
}: AnimatedBackButtonProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            onPressIn={() => setIsHovered(true)}
            onPressOut={() => setIsHovered(false)}
            activeOpacity={0.8}
        >
            {/* Outer circle (white) */}
            <MotiView
                style={[styles.circle, styles.outerCircle]}
                animate={{
                    opacity: isHovered ? 0 : 1,
                    scale: isHovered ? 0.7 : 1,
                }}
                transition={{
                    type: 'timing',
                    duration: isHovered ? 400 : 500,
                    delay: isHovered ? 0 : 80,
                }}
            />

            {/* Inner circle (blue) */}
            <MotiView
                style={[styles.circle, styles.innerCircle]}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 1.3,
                }}
                transition={{
                    type: 'timing',
                    duration: isHovered ? 400 : 400,
                    delay: isHovered ? 80 : 0,
                }}
            />

            {/* Arrow icon */}
            <MotiView
                style={styles.iconContainer}
                animate={{
                    translateX: isHovered ? -48 : 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 400,
                }}
            >
                <Ionicons name="arrow-back" size={size} color={color} />
                <Ionicons
                    name="arrow-back"
                    size={size}
                    color={color}
                    style={{ marginLeft: 48 }}
                />
            </MotiView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 3,
    },
    outerCircle: {
        borderColor: '#f0eeef',
    },
    innerCircle: {
        borderColor: '#96daf0',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
});

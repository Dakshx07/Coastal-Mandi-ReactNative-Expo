import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import VoiceAssistant from './VoiceAssistant';
import CalculatorModal from './CalculatorModal';

export default function FloatingActions() {
    const [showVoice, setShowVoice] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);

    const openVoice = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowVoice(true);
    };

    const openCalculator = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowCalculator(true);
    };

    return (
        <>
            <View style={styles.container} pointerEvents="box-none">
                {/* Calculator FAB */}
                <MotiView
                    from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    transition={{ delay: 300 }}
                >
                    <TouchableOpacity
                        style={styles.calcButton}
                        activeOpacity={0.8}
                        onPress={openCalculator}
                    >
                        <FontAwesome5 name="calculator" size={20} color="white" />
                    </TouchableOpacity>
                </MotiView>

                {/* Voice Assistant FAB */}
                <MotiView
                    from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    transition={{ delay: 400 }}
                >
                    <TouchableOpacity
                        style={styles.voiceWrapper}
                        activeOpacity={0.9}
                        onPress={openVoice}
                    >
                        <LinearGradient
                            colors={['#6366f1', '#8b5cf6']}
                            style={styles.voiceButton}
                        >
                            <Ionicons name="mic" size={28} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>
            </View>

            {/* Voice Assistant Modal */}
            <VoiceAssistant
                visible={showVoice}
                onClose={() => setShowVoice(false)}
            />

            {/* Calculator Modal */}
            <CalculatorModal
                visible={showCalculator}
                onClose={() => setShowCalculator(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        alignItems: 'center',
        gap: 16,
        zIndex: 100,
    },
    calcButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#22c55e',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    voiceWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voiceButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
});

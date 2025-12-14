import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceAssistantProps {
    visible: boolean;
    onClose: () => void;
}

// Mock fish data for demonstration
const FISH_PRICES: Record<string, { price: number; trend: string }> = {
    'seer fish': { price: 607, trend: 'down 12.79%' },
    'surmai': { price: 607, trend: 'down 12.79%' },
    'pomfret': { price: 602, trend: 'down 10.81%' },
    'sardine': { price: 141, trend: 'up 5.2%' },
    'mathi': { price: 141, trend: 'up 5.2%' },
    'mackerel': { price: 230, trend: 'up 8.4%' },
    'ayala': { price: 230, trend: 'up 8.4%' },
    'prawns': { price: 450, trend: 'down 2.1%' },
};

// Sample commands for demonstration
const SAMPLE_COMMANDS = [
    "What's the price of Seer Fish?",
    "Add Pomfret to cart",
    "Go to compare",
    "What's trending?",
    "Help",
];

export default function VoiceAssistant({ visible, onClose }: VoiceAssistantProps) {
    const [state, setState] = useState<VoiceState>('idle');
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

    const processCommand = useCallback(async (command: string) => {
        setState('processing');
        setTranscript(command);

        const lowerCommand = command.toLowerCase();
        let responseText = '';

        // Price query
        if (lowerCommand.includes('price of') || lowerCommand.includes('price for')) {
            const fishMatch = Object.keys(FISH_PRICES).find(fish =>
                lowerCommand.includes(fish)
            );

            if (fishMatch) {
                const data = FISH_PRICES[fishMatch];
                responseText = `${fishMatch.charAt(0).toUpperCase() + fishMatch.slice(1)} is ₹${data.price} per kg, ${data.trend}.`;
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                responseText = "Sorry, I couldn't find that fish. Try Seer Fish, Pomfret, or Sardine.";
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
        // Add to cart
        else if (lowerCommand.includes('add') && lowerCommand.includes('cart')) {
            responseText = "Added to your watchlist cart!";
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        // Navigation
        else if (lowerCommand.includes('go to')) {
            if (lowerCommand.includes('compare')) {
                responseText = "Opening Compare...";
                setTimeout(() => router.push('/(tabs)/compare'), 500);
            } else if (lowerCommand.includes('settings')) {
                responseText = "Opening Settings...";
                setTimeout(() => router.push('/(tabs)/settings'), 500);
            } else if (lowerCommand.includes('insights') || lowerCommand.includes('oracle')) {
                responseText = "Opening Market Oracle...";
                setTimeout(() => router.push('/(tabs)/insights'), 500);
            } else if (lowerCommand.includes('cart') || lowerCommand.includes('watchlist')) {
                responseText = "Opening Cart...";
                setTimeout(() => router.push('/(tabs)/cart'), 500);
            } else {
                responseText = "I can navigate to Compare, Insights, Cart, or Settings.";
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Trending
        else if (lowerCommand.includes('trending')) {
            responseText = "Today's trending: Sardine is up 5.2%, Mackerel up 8.4%. Seer Fish is down 12.79%.";
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        // Help
        else if (lowerCommand.includes('help')) {
            responseText = "You can ask: Price of fish name, Add fish to cart, Go to page, or What's trending.";
        }
        // Unknown
        else {
            responseText = "I didn't understand that. Try saying 'Help' for available commands.";
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        setResponse(responseText);
        setState('speaking');

        // Text-to-speech
        await Speech.speak(responseText, {
            language: 'en-IN',
            pitch: 1.0,
            rate: 0.9,
            onDone: () => setState('idle'),
            onError: () => setState('idle'),
        });
    }, []);

    const handleMockListen = () => {
        setState('listening');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Simulate listening for 2 seconds
        setTimeout(() => {
            if (selectedCommand) {
                processCommand(selectedCommand);
                setSelectedCommand(null);
            } else {
                setState('idle');
                setTranscript('');
                setResponse('No speech detected. Tap a sample command or speak clearly.');
            }
        }, 2000);
    };

    const handleQuickCommand = (command: string) => {
        setSelectedCommand(command);
        processCommand(command);
    };

    const handleClose = () => {
        Speech.stop();
        setState('idle');
        setTranscript('');
        setResponse('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={handleClose}
        >
            <BlurView intensity={60} tint="dark" style={styles.overlay}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.modal}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Voice Assistant</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    {/* Mic Button */}
                    <View style={styles.micContainer}>
                        <TouchableOpacity
                            onPress={handleMockListen}
                            activeOpacity={0.8}
                            disabled={state === 'processing' || state === 'speaking'}
                        >
                            {state === 'listening' && (
                                <MotiView
                                    from={{ scale: 1, opacity: 0.6 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ type: 'timing', duration: 1000, loop: true }}
                                    style={[StyleSheet.absoluteFillObject, styles.pulse]}
                                />
                            )}
                            <LinearGradient
                                colors={
                                    state === 'listening'
                                        ? ['#dc2626', '#f87171']
                                        : state === 'speaking'
                                            ? ['#22c55e', '#4ade80']
                                            : ['#6366f1', '#8b5cf6']
                                }
                                style={styles.micButton}
                            >
                                <Ionicons
                                    name={
                                        state === 'speaking' ? 'volume-high' :
                                            state === 'processing' ? 'hourglass' : 'mic'
                                    }
                                    size={36}
                                    color="white"
                                />
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.statusText}>
                            {state === 'idle' && 'Tap to speak'}
                            {state === 'listening' && 'Listening...'}
                            {state === 'processing' && 'Processing...'}
                            {state === 'speaking' && 'Speaking...'}
                        </Text>
                    </View>

                    {/* Transcript */}
                    {transcript ? (
                        <View style={styles.transcriptBox}>
                            <Text style={styles.transcriptLabel}>You said:</Text>
                            <Text style={styles.transcriptText}>{transcript}</Text>
                        </View>
                    ) : null}

                    {/* Response */}
                    {response ? (
                        <View style={styles.responseBox}>
                            <Text style={styles.responseLabel}>Response:</Text>
                            <Text style={styles.responseText}>{response}</Text>
                        </View>
                    ) : null}

                    {/* Quick Commands */}
                    <View style={styles.quickSection}>
                        <Text style={styles.quickLabel}>Try saying:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.quickList}
                        >
                            {SAMPLE_COMMANDS.map((cmd, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.quickChip}
                                    onPress={() => handleQuickCommand(cmd)}
                                >
                                    <Text style={styles.quickText}>{cmd}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Note about Expo Go */}
                    <Text style={styles.note}>
                        💡 Full voice input requires a development build
                    </Text>
                </MotiView>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: width * 0.9,
        maxWidth: 360,
        backgroundColor: '#151b28',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
    },
    closeBtn: {
        padding: 4,
    },
    micContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    pulse: {
        backgroundColor: '#6366f1',
        borderRadius: 50,
        width: 100,
        height: 100,
    },
    micButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    statusText: {
        color: '#94a3b8',
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
    },
    transcriptBox: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    transcriptLabel: {
        color: '#64748b',
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Outfit_500Medium',
    },
    transcriptText: {
        color: '#f8fafc',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    responseBox: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
    },
    responseLabel: {
        color: '#3b82f6',
        fontSize: 12,
        marginBottom: 4,
        fontFamily: 'Outfit_500Medium',
    },
    responseText: {
        color: '#f8fafc',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
        lineHeight: 22,
    },
    quickSection: {
        marginTop: 8,
    },
    quickLabel: {
        color: '#64748b',
        fontSize: 12,
        marginBottom: 8,
        fontFamily: 'Outfit_500Medium',
    },
    quickList: {
        gap: 8,
        paddingRight: 16,
    },
    quickChip: {
        backgroundColor: '#334155',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    quickText: {
        color: '#e2e8f0',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
    },
    note: {
        color: '#64748b',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 16,
        fontFamily: 'Outfit_400Regular',
    },
});

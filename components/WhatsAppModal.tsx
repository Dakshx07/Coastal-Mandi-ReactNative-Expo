import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { MotiView } from 'moti';

interface WhatsAppModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function WhatsAppModal({ visible, onClose }: WhatsAppModalProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubscribe = () => {
        if (phoneNumber.length < 10) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            // Open WhatsApp with pre-filled message
            const message = `🐟 Coastal Mandi Subscription ✅ I want to subscribe for FREE price alerts! 📍 Harbour: ALL 📱 Phone: ${phoneNumber}`;
            Linking.openURL(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`);

            // Auto close after success
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setPhoneNumber('');
            }, 2000);
        }, 1500);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Backdrop Blur */}
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <MotiView
                    from={{ translateY: 300, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        {/* Header Icon */}
                        <View style={styles.iconContainer}>
                            <FontAwesome name="whatsapp" size={40} color="#22c55e" />
                        </View>

                        {!isSuccess ? (
                            <>
                                <Text style={styles.title}>Instant Price Alerts</Text>
                                <Text style={styles.subtitle}>Get daily market rates directly on WhatsApp for FREE.</Text>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.countryCode}>🇮🇳 +91</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone Number"
                                        placeholderTextColor="#64748b"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        autoFocus
                                    />
                                </View>

                                {/* Feature List */}
                                <View style={styles.features}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                                        <Text style={styles.featureText}>Daily Morning Updates</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                                        <Text style={styles.featureText}>Market Trend Analysis</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, phoneNumber.length < 10 && styles.buttonDisabled]}
                                    onPress={handleSubscribe}
                                    disabled={phoneNumber.length < 10 || isSubmitting}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#0f172a', '#1e293b']}
                                        style={styles.buttonGradient}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Ionicons name="notifications-outline" size={20} color="white" />
                                                <Text style={styles.buttonText}>Activate Alerts</Text>
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/919876543210')} style={styles.testLink}>
                                    <Text style={styles.testLinkText}>Test with Demo Bot</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.successContainer}>
                                <MotiView
                                    from={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={styles.successIcon}
                                >
                                    <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
                                </MotiView>
                                <Text style={styles.successTitle}>Subscribed!</Text>
                                <Text style={styles.successSub}>Check your WhatsApp now.</Text>
                            </View>
                        )}
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    modalContent: {
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        alignItems: 'center',
        paddingBottom: 40,
        // Dark mode support handled via wrapper or prop if needed, sticking to design request white base for modal inside dark app for contrast or dark as requested? 
        // User requested: "Container: rounded-3xl, bg-white (Dark: bg-slate-800)"
        // Since we are moving to dark mode only, let's use dark bg.
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0f172a', // Dark circle
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginTop: -60, // Float above
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    countryCode: {
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        color: '#0f172a',
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: '#0f172a',
        height: '100%',
    },
    features: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featureText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        color: '#475569',
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
        color: 'white',
    },
    testLink: {
        marginTop: 16,
        padding: 8,
    },
    testLinkText: {
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        color: '#22c55e',
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        width: '100%',
    },
    successIcon: {
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    successSub: {
        fontSize: 16,
        color: '#64748b',
        fontFamily: 'Outfit_400Regular',
    },
});

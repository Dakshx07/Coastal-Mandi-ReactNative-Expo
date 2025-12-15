import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

interface SubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SubscriptionModal({ visible, onClose }: SubscriptionModalProps) {
    const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <MotiView
                    from={{ translateY: 500, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    style={styles.container}
                >
                    {/* Header */}
                    <LinearGradient
                        colors={['#0891b2', '#0d9488', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.header}
                    >
                        <View style={styles.headerContent}>
                            <View>
                                <Text style={styles.headerTitle}>Upgrade to Pro</Text>
                                <Text style={styles.headerSub}>Unlock real-time data & trends</Text>
                            </View>
                            <View style={styles.proIcon}>
                                <Ionicons name="diamond" size={24} color="white" />
                            </View>
                        </View>

                        {/* Decorative Circles */}
                        <View style={styles.circle1} />
                        <View style={styles.circle2} />
                    </LinearGradient>

                    <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>

                        {/* Plan Selection */}
                        <View style={styles.grid}>
                            {/* FREE PLAN */}
                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === 'free' && styles.planCardActive]}
                                onPress={() => setSelectedPlan('free')}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.planTitle}>Free</Text>
                                <Text style={styles.planPrice}>₹0</Text>
                                <Text style={styles.planPeriod}>forever</Text>

                                <View style={styles.featureList}>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark" size={14} color="#64748b" />
                                        <Text style={styles.featureText}>Daily Update (7 AM)</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark" size={14} color="#64748b" />
                                        <Text style={styles.featureText}> WhatsApp Alerts</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark" size={14} color="#64748b" />
                                        <Text style={styles.featureText}>All 9 Harbours</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* PREMIUM PLAN */}
                            <TouchableOpacity
                                style={[styles.planCard, styles.planCardPremium, selectedPlan === 'premium' && styles.planCardActivePremium]}
                                onPress={() => setSelectedPlan('premium')}
                                activeOpacity={0.9}
                            >
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>BEST VALUE</Text>
                                </View>
                                <Text style={[styles.planTitle, styles.textWhite]}>Premium</Text>
                                <Text style={[styles.planPrice, styles.textWhite]}>₹99</Text>
                                <Text style={[styles.planPeriod, styles.textWhiteOpt]}>/ month</Text>

                                <View style={styles.featureList}>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
                                        <Text style={[styles.featureText, styles.textWhite]}>Real-time Updates</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
                                        <Text style={[styles.featureText, styles.textWhite]}>Instant Alerts</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
                                        <Text style={[styles.featureText, styles.textWhite]}>AI Trend Predictons</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
                                        <Text style={[styles.featureText, styles.textWhite]}>Priority Support</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Input Form for Premium */}
                        {selectedPlan === 'premium' && (
                            <MotiView
                                from={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={styles.formContainer}
                            >
                                <Text style={styles.formLabel}>Enter Phone Number for Activation</Text>
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.prefix}>🇮🇳 +91</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="9876543210"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </View>
                            </MotiView>
                        )}

                        {/* Footer Trust */}
                        <View style={styles.trustRow}>
                            <View style={styles.trustItem}>
                                <Ionicons name="shield-checkmark" size={16} color="#94a3b8" />
                                <Text style={styles.trustText}>Secure</Text>
                            </View>
                            <View style={styles.trustItem}>
                                <Ionicons name="flash" size={16} color="#94a3b8" />
                                <Text style={styles.trustText}>Instant</Text>
                            </View>
                            <View style={styles.trustItem}>
                                <Ionicons name="star" size={16} color="#94a3b8" />
                                <Text style={styles.trustText}>4.8/5 Rated</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                            <Text style={styles.ctaText}>
                                {selectedPlan === 'free' ? 'Continue with Free' : 'Proceed to Pay ₹99'}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>

                    </ScrollView>
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
    container: {
        backgroundColor: '#0f172a',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '85%',
        overflow: 'hidden',
    },
    header: {
        padding: 24,
        paddingTop: 32,
        position: 'relative',
        overflow: 'hidden',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: 'white',
    },
    headerSub: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    proIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    circle1: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    circle2: {
        position: 'absolute',
        bottom: -40,
        left: 20,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    planCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    planCardActive: {
        borderColor: '#94a3b8',
    },
    planCardPremium: {
        backgroundColor: '#0f172a', // Darker bg for contrast with gradient border idea or just keep neat
        borderColor: '#0d9488',
        borderWidth: 2,
    },
    planCardActivePremium: {
        borderColor: '#14b8a6', // Brighter teal
        backgroundColor: '#134e4a', // Dark teal bg hint
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#f97316',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 14,
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    planTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
        color: 'white',
        marginBottom: 8,
    },
    planPrice: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: 'white',
    },
    planPeriod: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 16,
    },
    textWhite: {
        color: 'white',
    },
    textWhiteOpt: {
        color: 'rgba(255,255,255,0.7)',
    },
    featureList: {
        gap: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featureText: {
        fontSize: 11,
        color: '#cbd5e1',
        fontFamily: 'Outfit_500Medium',
    },
    formContainer: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    formLabel: {
        color: '#cbd5e1',
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Outfit_500Medium',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    prefix: {
        color: '#94a3b8',
        fontSize: 16,
        marginRight: 10,
        fontFamily: 'Outfit_600SemiBold',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        height: '100%',
    },
    trustRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 12,
    },
    trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trustText: {
        fontSize: 12,
        color: '#64748b',
        fontFamily: 'Outfit_500Medium',
    },
    ctaButton: {
        backgroundColor: '#0d9488',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#0d9488',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    ctaText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
});

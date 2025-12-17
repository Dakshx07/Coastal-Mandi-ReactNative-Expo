import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const handleGetStarted = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/signup');
    };

    const handleSignIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Main Deep Ocean Background */}
            <LinearGradient
                colors={['#020617', '#0f172a', '#172554']}
                style={StyleSheet.absoluteFill}
            />

            {/* Simulated "Wave" Elements (Safe Static Views) */}
            <View style={styles.waveContainer}>
                {/* Back Wave */}
                <View style={[styles.wave, styles.waveBack]} />
                {/* Front Wave */}
                <View style={[styles.wave, styles.waveFront]} />
            </View>

            <View style={styles.content}>
                {/* Language Selector */}
                {/* Top Spacer to keep layout consistent */}
                <View style={{ height: 40 }} />

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <LinearGradient
                            colors={['#3b82f6', '#2563eb']}
                            style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="boat" size={56} color="white" />
                    </View>
                </View>

                {/* Badge */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Ionicons name="globe-outline" size={16} color="#22d3ee" />
                        <Text style={styles.badgeText}>COASTAL INTELLIGENCE</Text>
                    </View>
                </View>

                {/* Headline */}
                <View style={styles.headlineContainer}>
                    <Text style={styles.headline}>
                        The Future of{'\n'}
                        <Text style={styles.headlineHighlight}>Market Rates</Text>
                    </Text>
                </View>

                {/* Subtitle */}
                <View>
                    <Text style={styles.subtitle}>
                        Empowering fishermen with real-time data, AI predictions, and trusted pricing.
                    </Text>
                </View>

                {/* Pills */}
                <View style={styles.pillsContainer}>
                    <View style={styles.featurePill}>
                        <Ionicons name="trending-up" size={16} color="#22c55e" />
                        <Text style={styles.pillText}>Live Trends</Text>
                    </View>
                    <View style={styles.featurePill}>
                        <Ionicons name="shield-checkmark" size={16} color="#3b82f6" />
                        <Text style={styles.pillText}>Verified Data</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                {/* CTA Buttons - Tighter Spacing */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        onPress={handleGetStarted}
                        activeOpacity={0.85}
                    >
                        <View style={styles.primaryBtnWrapper}>
                            <View style={styles.primaryBtn}>
                                <LinearGradient
                                    colors={['#0ea5e9', '#0284c7']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <Text style={styles.primaryBtnText}>Get Started</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSignIn}
                        style={styles.secondaryBtn}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryBtnText}>
                            Already have an account? <Text style={styles.signInHighlight}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    waveContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    wave: {
        position: 'absolute',
        width: width * 2,
        height: width * 2,
        borderRadius: width,
        left: -width / 2,
        bottom: -width * 1.2,
    },
    waveBack: {
        backgroundColor: 'rgba(34, 211, 238, 0.05)', // Cyan tint
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    waveFront: {
        backgroundColor: 'rgba(59, 130, 246, 0.08)', // Blue tint
        bottom: -width * 1.3,
        transform: [{ translateX: 50 }],
    },
    content: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 50,
        paddingBottom: 40,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    languageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    languageText: {
        color: '#f8fafc',
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
        overflow: 'hidden',
    },
    badgeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(34, 211, 238, 0.3)',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
    },
    badgeText: {
        color: '#94a3b8',
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 1,
    },
    headlineContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    headline: {
        fontSize: 36,
        fontFamily: 'Outfit_700Bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 44,
    },
    headlineHighlight: {
        color: '#22d3ee',
        fontSize: 36,
        fontFamily: 'Outfit_700Bold',
    },
    subtitle: {
        color: '#cbd5e1',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 24,
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    pillText: {
        color: '#f8fafc',
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
    },
    ctaContainer: {
        gap: 14,
    },
    primaryBtnWrapper: {
        position: 'relative',
    },
    primaryBtn: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        overflow: 'hidden',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
        zIndex: 1,
    },
    secondaryBtn: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        color: '#94a3b8',
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    signInHighlight: {
        color: '#22d3ee',
        fontFamily: 'Outfit_700Bold',
    },
});

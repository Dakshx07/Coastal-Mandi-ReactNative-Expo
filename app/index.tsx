import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
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
            <LinearGradient
                colors={['#0b0f19', '#111827', '#0f172a']}
                style={StyleSheet.absoluteFill}
            />

            {/* Background decorative elements */}
            <View style={styles.bgDecor}>
                <MotiView
                    from={{ opacity: 0.1 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ type: 'timing', duration: 3000, loop: true }}
                    style={styles.bgCircle1}
                />
                <MotiView
                    from={{ opacity: 0.05 }}
                    animate={{ opacity: 0.15 }}
                    transition={{ type: 'timing', duration: 4000, loop: true, delay: 1000 }}
                    style={styles.bgCircle2}
                />
            </View>

            <View style={styles.content}>
                {/* Language Selector */}
                <View style={styles.topBar}>
                    <View style={styles.languageBtn}>
                        <Text style={styles.flagEmoji}>🇺🇸</Text>
                        <Text style={styles.languageText}>English</Text>
                        <Ionicons name="chevron-down" size={14} color="#94a3b8" />
                    </View>
                </View>

                {/* Logo Section */}
                <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 800 }}
                    style={styles.logoContainer}
                >
                    <View style={styles.logoCircle}>
                        <Ionicons name="boat" size={48} color="#22d3ee" />
                    </View>
                </MotiView>

                {/* Badge */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 200 }}
                    style={styles.badgeContainer}
                >
                    <View style={styles.badge}>
                        <Ionicons name="globe-outline" size={14} color="#3b82f6" />
                        <Text style={styles.badgeText}>COASTAL INTELLIGENCE NETWORK</Text>
                    </View>
                </MotiView>

                {/* Main Headline */}
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 400 }}
                    style={styles.headlineContainer}
                >
                    <Text style={styles.headline}>
                        The Future of{'\n'}
                        <Text style={styles.headlineHighlight}>Market Rates</Text>
                    </Text>
                </MotiView>

                {/* Subtitle */}
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 600 }}
                >
                    <Text style={styles.subtitle}>
                        Empowering fishermen with real-time data, AI predictions, and trusted pricing.
                    </Text>
                </MotiView>

                {/* Feature Pills */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 800 }}
                    style={styles.pillsContainer}
                >
                    <View style={styles.featurePill}>
                        <Ionicons name="trending-up" size={16} color="#22c55e" />
                        <Text style={styles.pillText}>Live Trends</Text>
                    </View>
                    <View style={styles.featurePill}>
                        <Ionicons name="shield-checkmark" size={16} color="#3b82f6" />
                        <Text style={styles.pillText}>Verified Data</Text>
                    </View>
                </MotiView>

                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* CTA Buttons */}
                <MotiView
                    from={{ opacity: 0, translateY: 40 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 1000 }}
                    style={styles.ctaContainer}
                >
                    {/* Get Started Button */}
                    <TouchableOpacity
                        onPress={handleGetStarted}
                        activeOpacity={0.9}
                        style={styles.primaryBtnWrapper}
                    >
                        <LinearGradient
                            colors={['#0ea5e9', '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryBtn}
                        >
                            <Text style={styles.primaryBtnText}>Get Started</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        style={styles.secondaryBtn}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryBtnText}>
                            Already have an account? <Text style={styles.signInHighlight}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </MotiView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0f19',
    },
    bgDecor: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    bgCircle1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#3b82f6',
        top: -100,
        right: -150,
    },
    bgCircle2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#06b6d4',
        bottom: 100,
        left: -100,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 40,
    },
    languageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#334155',
    },
    flagEmoji: {
        fontSize: 14,
    },
    languageText: {
        color: '#f8fafc',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#334155',
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 10,
    },
    badgeContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    badgeText: {
        color: '#94a3b8',
        fontSize: 11,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 1,
    },
    headlineContainer: {
        alignItems: 'center',
        marginBottom: 20,
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
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 20,
    },
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 32,
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    pillText: {
        color: '#f8fafc',
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
    },
    ctaContainer: {
        gap: 16,
    },
    primaryBtnWrapper: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    primaryBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    primaryBtnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    secondaryBtn: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryBtnText: {
        color: '#94a3b8',
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
    },
    signInHighlight: {
        color: '#3b82f6',
        fontFamily: 'Outfit_700Bold',
    },
});

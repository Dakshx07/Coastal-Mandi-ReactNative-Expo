import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

export default function PremiumScreen() {
    const features = [
        { icon: 'analytics', text: 'Advanced Market Analytics', sub: 'Predictive trends & historical data' },
        { icon: 'notifications', text: 'Real-time Price Alerts', sub: 'Instant notification on price drops' },
        { icon: 'boat', text: 'Harbour Comparison', sub: 'Compare rates across 5+ harbours' },
        { icon: 'cloud-download', text: 'Export Reports', sub: 'Download daily price sheets (PDF/CSV)' },
    ];

    const handleSubscribe = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // In a real app, trigger payment flow
        router.push('/(tabs)/settings'); // Or show success modal
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header Image/Icon */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.headerIcon}
                    >
                        <LinearGradient
                            colors={['#fbbf24', '#d97706']}
                            style={styles.iconCircle}
                        >
                            <Ionicons name="diamond" size={40} color="white" />
                        </LinearGradient>
                    </MotiView>

                    <Text style={styles.title}>Unlock Premium</Text>
                    <Text style={styles.subtitle}>Get the edge in the fish market with powerful tools and insights.</Text>

                    {/* Features List */}
                    <View style={styles.featuresList}>
                        {features.map((feature, index) => (
                            <MotiView
                                key={index}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: index * 100 }}
                                style={styles.featureItem}
                            >
                                <View style={styles.featureIcon}>
                                    <Ionicons name={feature.icon as any} size={24} color="#fbbf24" />
                                </View>
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>{feature.text}</Text>
                                    <Text style={styles.featureSub}>{feature.sub}</Text>
                                </View>
                            </MotiView>
                        ))}
                    </View>

                    {/* Pricing Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 500 }}
                        style={styles.pricingCard}
                    >
                        <LinearGradient
                            colors={['rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.05)']}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.priceHeader}>
                            <Text style={styles.priceLabel}>PRO PLAN</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.currency}>₹</Text>
                                <Text style={styles.amount}>499</Text>
                                <Text style={styles.period}>/month</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.subscribeBtn}
                            onPress={handleSubscribe}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#fbbf24', '#d97706']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.btnGradient}
                            >
                                <Text style={styles.subscribeText}>Upgrade Now</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
    },
    headerIcon: {
        marginBottom: 24,
        marginTop: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    title: {
        fontSize: 32,
        fontFamily: 'Outfit_700Bold',
        color: 'white',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    featuresList: {
        width: '100%',
        gap: 20,
        marginBottom: 40,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        marginLeft: 16,
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: 'white',
        marginBottom: 4,
    },
    featureSub: {
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
        color: '#94a3b8',
    },
    pricingCard: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#fbbf24',
        overflow: 'hidden',
    },
    priceHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    priceLabel: {
        color: '#fbbf24',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 2,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    currency: {
        fontSize: 24,
        color: 'white',
        marginTop: 8,
        fontFamily: 'Outfit_500Medium',
    },
    amount: {
        fontSize: 56,
        color: 'white',
        fontFamily: 'Outfit_700Bold',
    },
    period: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 34,
        marginLeft: 4,
        fontFamily: 'Outfit_400Regular',
    },
    subscribeBtn: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    btnGradient: {
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    subscribeText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
});

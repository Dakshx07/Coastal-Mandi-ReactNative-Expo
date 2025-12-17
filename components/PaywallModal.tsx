import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface PaywallModalProps {
    visible: boolean;
    onClose: () => void;
    onSubscribe: () => void;
}

const BENEFITS = [
    { icon: 'globe', title: 'Unlock All Harbours', desc: 'Real-time prices from 7+ ports' },
    { icon: 'trending-up', title: 'AI Market Forecast', desc: 'Predict trends before they happen' },
    { icon: 'stats-chart', title: 'Historical Charts', desc: 'Analyze past 30 days of data' },
    { icon: 'notifications', title: 'Price Alerts', desc: 'Get notified when rates drop' },
];

export default function PaywallModal({ visible, onClose, onSubscribe }: PaywallModalProps) {
    const handleSubscribe = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSubscribe();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                <MotiView
                    from={{ translateY: 600 }}
                    animate={{ translateY: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    style={styles.modalContent}
                >
                    <LinearGradient
                        colors={[Colors.premium.card, Colors.premium.background]}
                        style={StyleSheet.absoluteFill}
                    />

                    {/* Pro Badge */}
                    <View style={styles.proBadge}>
                        <Ionicons name="star" size={14} color={Colors.premium.background} />
                        <Text style={styles.proBadgeText}>CAPTAIN'S PASS</Text>
                    </View>

                    <Text style={styles.title}>Unlock Professional Market Intelligence</Text>
                    <Text style={styles.subtitle}>
                        Gain the unfair advantage with real-time data from every major harbour.
                    </Text>

                    {/* Benefits List */}
                    <View style={styles.benefitsContainer}>
                        {BENEFITS.map((benefit, index) => (
                            <View key={index} style={styles.benefitRow}>
                                <View style={styles.iconBox}>
                                    <Ionicons name={benefit.icon as any} size={20} color={Colors.premium.gold} />
                                </View>
                                <View style={styles.benefitText}>
                                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                    <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Pricing */}
                    <View style={styles.pricingContainer}>
                        <Text style={styles.price}>₹499</Text>
                        <Text style={styles.period}>/ month</Text>
                    </View>

                    {/* Subscribe Button */}
                    <TouchableOpacity
                        onPress={handleSubscribe}
                        activeOpacity={0.9}
                        style={styles.subscribeBtnWrapper}
                    >
                        <LinearGradient
                            colors={[Colors.premium.gold, '#b49430']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.subscribeBtn}
                        >
                            <Text style={styles.subscribeText}>Get Captain's Pass</Text>
                            <Ionicons name="arrow-forward" size={20} color={Colors.premium.background} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={styles.dismissBtn}>
                        <Text style={styles.dismissText}>Maybe Later</Text>
                    </TouchableOpacity>

                </MotiView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: '85%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        overflow: 'hidden',
        borderTopWidth: 1,
        borderColor: Colors.premium.gold,
    },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.premium.gold,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        marginBottom: 20,
    },
    proBadgeText: {
        color: Colors.premium.background,
        fontSize: 12,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 1,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 10,
        lineHeight: 34,
    },
    subtitle: {
        color: Colors.premium.textDim,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
        marginBottom: 32,
        lineHeight: 22,
    },
    benefitsContainer: {
        gap: 20,
        marginBottom: 32,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    benefitText: {
        flex: 1,
    },
    benefitTitle: {
        color: Colors.premium.text,
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 4,
    },
    benefitDesc: {
        color: Colors.premium.textDim,
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
    },
    pricingContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 24,
    },
    price: {
        color: Colors.premium.gold,
        fontSize: 42,
        fontFamily: 'Outfit_700Bold',
    },
    period: {
        color: Colors.premium.textDim,
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
        marginLeft: 4,
    },
    subscribeBtnWrapper: {
        shadowColor: Colors.premium.gold,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    subscribeBtn: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    subscribeText: {
        color: Colors.premium.background,
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    dismissBtn: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    dismissText: {
        color: Colors.premium.textDim,
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
    },
});

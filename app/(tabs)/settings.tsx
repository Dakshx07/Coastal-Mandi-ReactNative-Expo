import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Linking,
    Modal,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

import PersonAvatar from '@/components/PersonAvatar';
import AnimatedBackButton from '@/components/AnimatedBackButton';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    buttons: { text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }[];
    onClose: () => void;
}

function CustomModal({ visible, title, message, buttons, onClose }: CustomModalProps) {
    const { colors, isDark } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>{message}</Text>
                    <View style={styles.modalButtons}>
                        {buttons.map((btn, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.modalButton,
                                    { backgroundColor: colors.surfaceLight },
                                    btn.style === 'destructive' && { backgroundColor: '#7f1d1d' },
                                    btn.style === 'cancel' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
                                ]}
                                onPress={() => {
                                    onClose();
                                    btn.onPress?.();
                                }}
                            >
                                <Text style={[
                                    styles.modalButtonText,
                                    { color: colors.text },
                                    btn.style === 'destructive' && { color: '#ef4444' },
                                    btn.style === 'cancel' && { color: colors.textSecondary },
                                ]}>
                                    {btn.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

interface SettingItem {
    icon: string;
    iconFamily: 'ionicons' | 'fontawesome';
    title: string;
    subtitle?: string;
    type: 'arrow' | 'switch' | 'label';
    value?: boolean | string;
    onPress?: () => void;
    onToggle?: (value: boolean) => void;
    iconColor?: string;
}

import SubscriptionModal from '@/components/SubscriptionModal';

export default function SettingsScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout: userLogout } = useUser();
    const [notifications, setNotifications] = useState(true);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [language, setLanguage] = useState('English');
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const { clearCart, items } = useCart();

    // Modal states
    const [modal, setModal] = useState<{ visible: boolean; title: string; message: string; buttons: any[] }>({
        visible: false,
        title: '',
        message: '',
        buttons: [],
    });

    const avatarSeed = `user-${new Date().toDateString()}`;

    const showModal = (title: string, message: string, buttons: any[]) => {
        setModal({ visible: true, title, message, buttons });
    };

    const handleBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    const handleLogout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        showModal('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await userLogout(); // Clears storage and state
                    } catch (e) {
                        console.error('Logout error caught in UI', e);
                    } finally {
                        clearCart();
                        // Force navigation to root and reset stack
                        if (router.canGoBack()) {
                            router.dismissAll();
                        }
                        router.replace('/');
                    }
                },
            },
        ]);
    };

    const handleClearWatchlist = () => {
        if (items.length === 0) {
            showModal('Watchlist Empty', 'You have no items in your watchlist.', [
                { text: 'OK' },
            ]);
            return;
        }
        showModal('Clear Watchlist', `Remove all ${items.length} items from your watchlist?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear All',
                style: 'destructive',
                onPress: () => {
                    clearCart();
                    showModal('Done', 'Watchlist cleared!', [{ text: 'OK' }]);
                },
            },
        ]);
    };

    const handleLanguageChange = () => {
        showModal('Select Language', 'Choose your preferred language', [
            { text: 'English', onPress: () => setLanguage('English') },
            { text: 'हिन्दी (Hindi)', onPress: () => setLanguage('Hindi') },
            { text: 'മലയാളം (Malayalam)', onPress: () => setLanguage('Malayalam') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleContactSupport = () => {
        showModal('Contact Support', 'How would you like to reach us?', [
            { text: 'Email', onPress: () => Linking.openURL('mailto:support@coastalmandi.in') },
            { text: 'WhatsApp', onPress: () => Linking.openURL('https://wa.me/919876543210?text=Hi%20Coastal%20Mandi%20Support') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleRateApp = () => {
        showModal('Rate Coastal Mandi ⭐', 'Your feedback helps us improve!', [
            { text: 'Not Now', style: 'cancel' },
            { text: 'Rate 5 Stars', onPress: () => showModal('Thank You!', 'We appreciate your support!', [{ text: 'OK' }]) },
        ]);
    };

    const handleHelpFaq = () => {
        showModal(
            'Help & FAQ',
            '• How do I add fish to watchlist?\n   Tap the + button on any fish card\n\n• Where does the price data come from?\n   Direct from harbour traders, updated daily\n\n• How accurate is the AI analysis?\n   Based on historical trends and market patterns',
            [{ text: 'Got it!' }]
        );
    };

    const settingsSections: { title: string; items: SettingItem[] }[] = [
        {
            title: 'SUBSCRIPTION',
            items: [
                {
                    icon: 'diamond',
                    iconFamily: 'ionicons',
                    title: 'Upgrade to Premium',
                    subtitle: 'Real-time alerts & trends',
                    type: 'arrow',
                    onPress: () => setShowPremiumModal(true),
                    iconColor: '#22c55e', // Green/Emerald
                },
            ],
        },
        {
            title: 'NOTIFICATIONS',
            items: [
                {
                    icon: 'notifications',
                    iconFamily: 'ionicons',
                    title: 'Push Notifications',
                    subtitle: 'Daily price updates',
                    type: 'switch',
                    value: notifications,
                    onToggle: setNotifications,
                    iconColor: '#3b82f6',
                },
                {
                    icon: 'pulse',
                    iconFamily: 'ionicons',
                    title: 'Price Alerts',
                    subtitle: 'Get notified on big price changes',
                    type: 'switch',
                    value: priceAlerts,
                    onToggle: setPriceAlerts,
                    iconColor: '#22c55e',
                },
            ],
        },
        {
            title: 'PREFERENCES',
            items: [
                {
                    icon: 'language',
                    iconFamily: 'ionicons',
                    title: 'Language',
                    type: 'label',
                    value: language,
                    onPress: handleLanguageChange,
                    iconColor: '#eab308',
                },
            ],
        },
        {
            title: 'DATA',
            items: [
                {
                    icon: 'heart',
                    iconFamily: 'ionicons',
                    title: 'Clear Watchlist',
                    subtitle: `${items.length} items saved`,
                    type: 'arrow',
                    onPress: handleClearWatchlist,
                    iconColor: '#ef4444',
                },
            ],
        },
        {
            title: 'SUPPORT',
            items: [
                {
                    icon: 'help-circle',
                    iconFamily: 'ionicons',
                    title: 'Help & FAQ',
                    type: 'arrow',
                    onPress: handleHelpFaq,
                    iconColor: '#3b82f6',
                },
                {
                    icon: 'chatbubble-ellipses',
                    iconFamily: 'ionicons',
                    title: 'Contact Support',
                    type: 'arrow',
                    onPress: handleContactSupport,
                    iconColor: '#22c55e',
                },
                {
                    icon: 'star',
                    iconFamily: 'ionicons',
                    title: 'Rate App',
                    type: 'arrow',
                    onPress: handleRateApp,
                    iconColor: '#eab308',
                },
            ],
        },
        {
            title: 'ABOUT',
            items: [
                {
                    icon: 'information-circle',
                    iconFamily: 'ionicons',
                    title: 'App Version',
                    type: 'label',
                    value: '1.0.0',
                    iconColor: '#64748b',
                },
            ],
        },
    ];

    const renderIcon = (item: SettingItem) => {
        if (item.iconFamily === 'fontawesome') {
            return <FontAwesome5 name={item.icon} size={16} color={item.iconColor || colors.textSecondary} />;
        }
        return <Ionicons name={item.icon as any} size={20} color={item.iconColor || colors.textSecondary} />;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header - No Back Button as per request */}
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: colors.text, fontSize: 24 }]}>Settings</Text>
                    </View>

                    {/* Profile Card - No Verified Badge */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                        <PersonAvatar seed={user.email || avatarSeed} size={64} />
                        <View style={styles.profileInfo}>
                            <Text style={[styles.profileName, { color: colors.text }]}>
                                {user.name || 'Coastal User'}
                            </Text>
                            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
                                {user.email || 'Not signed in'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowPremiumModal(true)}>
                                <View style={[styles.profileBadge, { backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' }]}>
                                    <Ionicons name="sparkles" size={12} color="#fbbf24" />
                                    <Text style={[styles.badgeText, { color: 'white' }]}>Get Premium</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    {/* Settings Sections */}
                    {settingsSections.map((section, sectionIndex) => (
                        <MotiView
                            key={section.title}
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: sectionIndex * 50 }}
                            style={styles.section}
                        >
                            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{section.title}</Text>
                            <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                {section.items.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.title}
                                        style={[
                                            styles.settingItem,
                                            index < section.items.length - 1 && [styles.settingItemBorder, { borderBottomColor: colors.border }],
                                        ]}
                                        onPress={item.onPress}
                                        activeOpacity={item.type === 'switch' ? 1 : 0.7}
                                    >
                                        <View style={styles.settingLeft}>
                                            <View style={[styles.iconWrapper, { backgroundColor: `${item.iconColor}15` }]}>
                                                {renderIcon(item)}
                                            </View>
                                            <View style={styles.settingTextWrapper}>
                                                <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                                                {item.subtitle && (
                                                    <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.settingRight}>
                                            {item.type === 'switch' && (
                                                <Switch
                                                    value={item.value as boolean}
                                                    onValueChange={item.onToggle}
                                                    trackColor={{ false: colors.surfaceLight, true: colors.primary }}
                                                    thumbColor={item.value ? '#fff' : colors.textSecondary}
                                                />
                                            )}
                                            {item.type === 'arrow' && (
                                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                                            )}
                                            {item.type === 'label' && (
                                                <View style={styles.labelContainer}>
                                                    <Text style={[styles.labelValue, { color: colors.textMuted }]}>{item.value}</Text>
                                                    {item.onPress && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </MotiView>
                    ))}

                    {/* Logout Button */}
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300 }}
                    >
                        <TouchableOpacity
                            style={[styles.logoutBtn, { backgroundColor: colors.surface }]}
                            onPress={handleLogout}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </MotiView>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Custom Modal */}
            <CustomModal
                visible={modal.visible}
                title={modal.title}
                message={modal.message}
                buttons={modal.buttons}
                onClose={() => setModal(prev => ({ ...prev, visible: false }))}
            />

            {/* Premium Subscription Modal */}
            <SubscriptionModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    profileCard: {
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 14,
    },
    profileName: {
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    profileEmail: {
        fontSize: 13,
        marginTop: 2,
    },
    profileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    badgeText: {
        color: '#22c55e',
        fontSize: 11,
        fontFamily: 'Outfit_500Medium',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        letterSpacing: 1.5,
        marginBottom: 10,
        marginLeft: 4,
        fontFamily: 'Outfit_700Bold',
    },
    sectionContent: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTextWrapper: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
    },
    settingSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    settingRight: {
        marginLeft: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    labelValue: {
        fontSize: 14,
    },
    logoutBtn: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#7f1d1d',
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
        lineHeight: 22,
        marginBottom: 24,
        textAlign: 'center',
    },
    modalButtons: {
        gap: 10,
    },
    modalButton: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 15,
        fontFamily: 'Outfit_600SemiBold',
    },
});

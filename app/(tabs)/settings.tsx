import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface SettingItem {
    icon: string;
    iconFamily: 'ionicons' | 'fontawesome';
    title: string;
    subtitle?: string;
    type: 'arrow' | 'switch' | 'label';
    value?: boolean | string;
    onPress?: () => void;
    onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState('English');

    const handleLogout = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => router.replace('/login')
                },
            ]
        );
    };

    const settingsSections: { title: string; items: SettingItem[] }[] = [
        {
            title: 'Preferences',
            items: [
                {
                    icon: 'notifications',
                    iconFamily: 'ionicons',
                    title: 'Push Notifications',
                    subtitle: 'Price alerts and updates',
                    type: 'switch',
                    value: notifications,
                    onToggle: setNotifications,
                },
                {
                    icon: 'moon',
                    iconFamily: 'ionicons',
                    title: 'Dark Mode',
                    subtitle: 'Always on',
                    type: 'switch',
                    value: darkMode,
                    onToggle: setDarkMode,
                },
                {
                    icon: 'language',
                    iconFamily: 'ionicons',
                    title: 'Language',
                    type: 'label',
                    value: language,
                    onPress: () => Alert.alert('Languages', 'English, Hindi, Malayalam, Kannada coming soon!'),
                },
            ],
        },
        {
            title: 'Data & Storage',
            items: [
                {
                    icon: 'cloud-download',
                    iconFamily: 'ionicons',
                    title: 'Offline Data',
                    subtitle: 'Manage cached data',
                    type: 'arrow',
                    onPress: () => Alert.alert('Offline Data', 'Clear cache or download data for offline use.'),
                },
                {
                    icon: 'server',
                    iconFamily: 'fontawesome',
                    title: 'Data Usage',
                    subtitle: '12.4 MB used',
                    type: 'arrow',
                    onPress: () => { },
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: 'help-circle',
                    iconFamily: 'ionicons',
                    title: 'Help & FAQ',
                    type: 'arrow',
                    onPress: () => { },
                },
                {
                    icon: 'chatbubble-ellipses',
                    iconFamily: 'ionicons',
                    title: 'Contact Support',
                    type: 'arrow',
                    onPress: () => { },
                },
                {
                    icon: 'star',
                    iconFamily: 'ionicons',
                    title: 'Rate App',
                    type: 'arrow',
                    onPress: () => { },
                },
            ],
        },
        {
            title: 'About',
            items: [
                {
                    icon: 'information-circle',
                    iconFamily: 'ionicons',
                    title: 'App Version',
                    type: 'label',
                    value: '1.0.0',
                },
                {
                    icon: 'document-text',
                    iconFamily: 'ionicons',
                    title: 'Terms of Service',
                    type: 'arrow',
                    onPress: () => { },
                },
                {
                    icon: 'shield-checkmark',
                    iconFamily: 'ionicons',
                    title: 'Privacy Policy',
                    type: 'arrow',
                    onPress: () => { },
                },
            ],
        },
    ];

    const renderIcon = (item: SettingItem) => {
        if (item.iconFamily === 'fontawesome') {
            return <FontAwesome5 name={item.icon} size={18} color="#94a3b8" />;
        }
        return <Ionicons name={item.icon as any} size={22} color="#94a3b8" />;
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <Image
                            source={{ uri: 'https://placehold.co/100x100/3b82f6/FFF?text=U' }}
                            style={styles.avatar}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>Fisherman User</Text>
                            <Text style={styles.profileEmail}>user@coastal.app</Text>
                        </View>
                        <TouchableOpacity style={styles.editBtn}>
                            <Ionicons name="pencil" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>

                    {/* Settings Sections */}
                    {settingsSections.map((section) => (
                        <View key={section.title} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <View style={styles.sectionContent}>
                                {section.items.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.title}
                                        style={[
                                            styles.settingItem,
                                            index < section.items.length - 1 && styles.settingItemBorder,
                                        ]}
                                        onPress={item.onPress}
                                        activeOpacity={item.type === 'switch' ? 1 : 0.7}
                                    >
                                        <View style={styles.settingLeft}>
                                            <View style={styles.iconWrapper}>
                                                {renderIcon(item)}
                                            </View>
                                            <View>
                                                <Text style={styles.settingTitle}>{item.title}</Text>
                                                {item.subtitle && (
                                                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.settingRight}>
                                            {item.type === 'switch' && (
                                                <Switch
                                                    value={item.value as boolean}
                                                    onValueChange={item.onToggle}
                                                    trackColor={{ false: '#334155', true: '#3b82f6' }}
                                                    thumbColor={item.value ? '#fff' : '#94a3b8'}
                                                />
                                            )}
                                            {item.type === 'arrow' && (
                                                <Ionicons name="chevron-forward" size={20} color="#64748b" />
                                            )}
                                            {item.type === 'label' && (
                                                <Text style={styles.labelValue}>{item.value}</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={handleLogout}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0f19',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#334155',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    profileName: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    profileEmail: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 2,
    },
    editBtn: {
        padding: 8,
        backgroundColor: '#0f172a',
        borderRadius: 10,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#64748b',
        fontSize: 12,
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
        fontFamily: 'Outfit_700Bold',
    },
    sectionContent: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
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
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitle: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
    },
    settingSubtitle: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 2,
    },
    settingRight: {
        marginLeft: 8,
    },
    labelValue: {
        color: '#64748b',
        fontSize: 14,
    },
    logoutBtn: {
        backgroundColor: '#1e293b',
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
});

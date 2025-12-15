import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import FishAvatar from './FishAvatar';

interface AppHeaderProps {
    showSettings?: boolean;
}

export default function AppHeader({ showSettings = true }: AppHeaderProps) {
    const handleSettingsPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(tabs)/settings');
    };

    // Generate a consistent avatar based on time (changes daily)
    const avatarSeed = `user-${new Date().toDateString()}`;

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <View style={styles.logoCircle} />
                <Text style={styles.logoText}>COASTAL MANDI</Text>
            </View>

            {showSettings && (
                <TouchableOpacity style={styles.settingsBtn} onPress={handleSettingsPress}>
                    <Text style={styles.settingsBtnText}>Settings</Text>
                    <FishAvatar seed={avatarSeed} size={32} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3b82f6',
    },
    logoText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 0.5,
    },
    settingsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingLeft: 12,
        paddingRight: 4,
        paddingVertical: 4,
        borderRadius: 24,
        gap: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    settingsBtnText: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
});

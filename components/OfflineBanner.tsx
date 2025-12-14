import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import useNetworkStatus from '@/hooks/useNetworkStatus';

export default function OfflineBanner() {
    const { isConnected } = useNetworkStatus();

    if (isConnected) {
        return null;
    }

    return (
        <MotiView
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -50 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.container}
        >
            <Ionicons name="cloud-offline" size={18} color="#854d0e" />
            <Text style={styles.text}>You're offline. Some features may be unavailable.</Text>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fef3c7', // Amber 100
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    text: {
        color: '#854d0e', // Amber 800
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
        flex: 1,
    },
});

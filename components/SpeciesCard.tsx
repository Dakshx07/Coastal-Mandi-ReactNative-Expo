import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SpeciesCardProps {
    id: string;
    name: string;
    scientificName: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
    imageUrl: string;
    trustScore?: number;
    onAddToCart?: () => void;
}

export default function SpeciesCard({
    name,
    scientificName,
    price,
    trend,
    trendPercentage,
    imageUrl,
    trustScore,
    onAddToCart,
}: SpeciesCardProps) {
    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onAddToCart?.();
    };

    return (
        <View style={styles.card}>
            {/* Image */}
            <Image source={{ uri: imageUrl }} style={styles.image} />

            {/* Content */}
            <View style={styles.content}>
                {/* Name and Price Row */}
                <View style={styles.topRow}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {name}
                        </Text>
                        <Text style={styles.scientificName} numberOfLines={1} ellipsizeMode="tail">
                            {scientificName}
                        </Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{price}</Text>
                        <Text style={styles.priceUnit}>/kg</Text>
                    </View>
                </View>

                {/* Footer Row - Badges and Add Button */}
                <View style={styles.footer}>
                    {/* Trend Badge */}
                    <View style={[
                        styles.trendPill,
                        { backgroundColor: trend === 'down' ? '#450a0a' : '#052e16' }
                    ]}>
                        <Ionicons
                            name={trend === 'down' ? "trending-down" : "trending-up"}
                            size={12}
                            color={trend === 'down' ? '#ef4444' : '#22c55e'}
                        />
                        <Text style={[
                            styles.trendText,
                            { color: trend === 'down' ? '#ef4444' : '#22c55e' }
                        ]}>
                            {trend === 'down' ? 'Down' : 'Up'} {trendPercentage.toFixed(1)}%
                        </Text>
                    </View>

                    {/* Trust Badge */}
                    {trustScore && (
                        <View style={styles.trustPill}>
                            <Ionicons name="shield-checkmark" size={11} color="#22c55e" />
                            <Text style={styles.trustText}>{trustScore}% Trust</Text>
                        </View>
                    )}

                    {/* Spacer */}
                    <View style={{ flex: 1 }} />

                    {/* Add Button */}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddToCart}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
        minHeight: 100,
    },
    image: {
        width: 76,
        height: 76,
        borderRadius: 12,
        backgroundColor: '#334155',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    nameContainer: {
        flex: 1,
        marginRight: 12,
    },
    name: {
        color: '#f8fafc',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        lineHeight: 22,
    },
    scientificName: {
        color: '#64748b',
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        marginTop: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        color: '#f8fafc',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
    },
    priceUnit: {
        color: '#64748b',
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
    },
    trendText: {
        fontSize: 11,
        fontFamily: 'Outfit_700Bold',
    },
    trustPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#334155',
        gap: 4,
    },
    trustText: {
        color: '#94a3b8',
        fontSize: 11,
        fontFamily: 'Outfit_500Medium',
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

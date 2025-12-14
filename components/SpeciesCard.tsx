import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SpeciesCardProps {
    id: string;
    name: string;
    scientificName: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
    imageUrl: string;
    trustScore?: number;
}

export default function SpeciesCard({
    name,
    scientificName,
    price,
    trend,
    trendPercentage,
    imageUrl,
    trustScore
}: SpeciesCardProps) {
    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.price}>₹{price}</Text>
                </View>

                <Text style={styles.scientificName}>{scientificName}</Text>

                <View style={styles.footer}>
                    <View style={[
                        styles.trendPill,
                        { backgroundColor: trend === 'down' ? '#450a0a' : '#052e16' }
                    ]}>
                        <Ionicons
                            name={trend === 'down' ? "trending-down" : "trending-up"}
                            size={14}
                            color={trend === 'down' ? '#ef4444' : '#22c55e'}
                        />
                        <Text style={[
                            styles.trendText,
                            { color: trend === 'down' ? '#ef4444' : '#22c55e' }
                        ]}>
                            {trend === 'down' ? 'Down' : 'Up'} {trendPercentage}%
                        </Text>
                    </View>

                    {trustScore && (
                        <View style={styles.trustPill}>
                            <FontAwesome5 name="shield-alt" size={12} color="#94a3b8" />
                            <Text style={styles.trustText}>{trustScore}% Trust</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#334155',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        color: '#f8fafc',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    price: {
        color: '#f8fafc',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    scientificName: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    trendText: {
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
    },
    trustPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#0f172a',
        gap: 4,
    },
    trustText: {
        color: '#94a3b8',
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
});

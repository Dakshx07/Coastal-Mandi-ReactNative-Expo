import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

interface WeatherHeaderProps {
    harbour: string;
    weather: { temp: number; condition: string; wind: number; humidity: number };
    today: string;
    speciesCount: number;
}

const WeatherHeader = ({ harbour, weather, today, speciesCount }: WeatherHeaderProps) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700 }}
            style={styles.headerContent}
        >
            <LinearGradient
                colors={['#0ea5e9', '#0284c7', '#0369a1']} // Day/Ocean Blue Theme
                style={styles.weatherCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.weatherRow}>
                    <View>
                        <Text style={styles.dateText}>{today}</Text>
                        <Text style={styles.locationText}>{harbour}</Text>
                    </View>
                    <View style={styles.weatherInfo}>
                        <Ionicons name={weather.condition === 'Sunny' ? 'sunny' :
                            weather.condition === 'Cloudy' ? 'cloudy' :
                                'partly-sunny'} size={24} color="#fcd34d" />
                        <Text style={styles.tempText}>{weather.temp}°C</Text>
                    </View>
                </View>
                <View style={styles.weatherDetails}>
                    <View style={styles.weatherDetailItem}>
                        <Ionicons name="water-outline" size={14} color="#e0f2fe" />
                        <Text style={styles.humidityText}>{weather.humidity}% Humidity</Text>
                    </View>
                    <View style={styles.weatherDetailItem}>
                        <Ionicons name="filter-outline" size={14} color="#e0f2fe" />
                        <Text style={styles.humidityText}>{weather.wind} km/h Wind</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* List Title */}
            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>TODAY'S RATES</Text>
                <Text style={styles.itemCount}>{speciesCount} species</Text>
            </View>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        marginBottom: 12,
    },
    weatherCard: {
        borderRadius: 14,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    weatherInfo: {
        alignItems: 'flex-end',
    },
    dateText: {
        color: '#e0f2fe',
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        marginBottom: 4,
    },
    locationText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 0.5,
    },
    tempText: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
    },
    weatherDetails: {
        flexDirection: 'row',
        gap: 12,
    },
    weatherDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    humidityText: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'Outfit_500Medium',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        color: '#94a3b8',
        fontSize: 11,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
    itemCount: {
        color: '#64748b',
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
    },
});

export default memo(WeatherHeader);

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ScrollView,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Line, Circle, Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

import { getMarketPrediction } from '@/services/ai';

const { width } = Dimensions.get('window');

interface SpeciesData {
    id: string;
    name: string;
    scientificName: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
    imageUrl: string;
}

interface FishDetailModalProps {
    visible: boolean;
    species: SpeciesData | null;
    onClose: () => void;
    onAddToCart: (species: SpeciesData) => void;
}

// Mock price history data for chart
const generatePriceHistory = (currentPrice: number, trend: 'up' | 'down') => {
    const data = [];
    const variance = currentPrice * 0.15;
    let basePrice = trend === 'down' ? currentPrice + variance * 0.5 : currentPrice - variance * 0.5;

    for (let i = 0; i < 7; i++) {
        const fluctuation = (Math.random() - 0.5) * variance * 0.3;
        const trendAdjust = trend === 'down' ? -i * (variance / 10) : i * (variance / 10);
        data.push({
            date: `12-${String(10 + i * 2).padStart(2, '0')}`,
            price: Math.round(basePrice + fluctuation + trendAdjust),
        });
    }

    // Make last point the current price
    data[data.length - 1].price = currentPrice;
    return data;
};

export default function FishDetailModal({ visible, species, onClose, onAddToCart }: FishDetailModalProps) {
    const [forecast, setForecast] = useState<string>('');
    const [loadingForecast, setLoadingForecast] = useState(false);

    const priceHistory = species ? generatePriceHistory(species.price, species.trend) : [];

    useEffect(() => {
        if (visible && species) {
            fetchForecast();
        }
    }, [visible, species]);

    const fetchForecast = async () => {
        if (!species) return;
        setLoadingForecast(true);
        try {
            const prediction = await getMarketPrediction(
                species.name,
                species.price,
                species.trend,
                species.trendPercentage
            );
            setForecast(prediction);
        } catch (error) {
            setForecast(`Based on current trends, ${species.name} prices are expected to ${species.trend === 'down' ? 'continue declining' : 'rise'} over the next week.`);
        }
        setLoadingForecast(false);
    };

    const shareOnWhatsApp = () => {
        if (!species) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const message = `🐟 *${species.name}* is now ₹${species.price}/kg!\n\n📊 ${species.trend === 'down' ? '📉' : '📈'} ${species.trendPercentage}% ${species.trend} today\n\n🏪 Kochi Harbour - Coastal Mandi`;
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

        Linking.openURL(whatsappUrl).catch(() => {
            // WhatsApp not installed
        });
    };

    const handleAddToCart = () => {
        if (species) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onAddToCart(species);
            onClose();
        }
    };

    if (!species) return null;

    // Chart dimensions
    const chartWidth = width - 80;
    const chartHeight = 120;
    const padding = 20;

    // Calculate chart points
    const maxPrice = Math.max(...priceHistory.map(d => d.price));
    const minPrice = Math.min(...priceHistory.map(d => d.price));
    const priceRange = maxPrice - minPrice || 1;

    const points = priceHistory.map((d, i) => ({
        x: padding + (i / (priceHistory.length - 1)) * (chartWidth - padding * 2),
        y: padding + ((maxPrice - d.price) / priceRange) * (chartHeight - padding * 2),
        ...d,
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = pathD + ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                <MotiView
                    from={{ opacity: 0, translateY: 100 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.modal}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.speciesName}>{species.name}</Text>
                                <Text style={styles.scientificName}>{species.scientificName}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Price Section */}
                        <View style={styles.priceSection}>
                            <View>
                                <Text style={styles.priceLabel}>CURRENT MARKET RATE</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>₹{species.price}</Text>
                                    <Text style={styles.priceUnit}>/kg</Text>
                                </View>
                            </View>
                            <View style={[
                                styles.trendBadge,
                                { backgroundColor: species.trend === 'down' ? '#450a0a' : '#052e16' }
                            ]}>
                                <Text style={[
                                    styles.trendText,
                                    { color: species.trend === 'down' ? '#ef4444' : '#22c55e' }
                                ]}>
                                    {species.trend === 'down' ? 'Down' : 'Up'} {species.trendPercentage}% Today
                                </Text>
                            </View>
                        </View>

                        {/* WhatsApp Share */}
                        <TouchableOpacity
                            style={styles.whatsappBtn}
                            onPress={shareOnWhatsApp}
                            activeOpacity={0.8}
                        >
                            <FontAwesome5 name="whatsapp" size={20} color="white" />
                            <Text style={styles.whatsappText}>Share Deal on WhatsApp</Text>
                        </TouchableOpacity>

                        {/* Price Chart */}
                        <View style={styles.chartContainer}>
                            <Svg width={chartWidth} height={chartHeight + 30}>
                                <Defs>
                                    <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                        <Stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                                    </SvgLinearGradient>
                                </Defs>

                                {/* Grid lines */}
                                {[0, 1, 2].map((i) => (
                                    <Line
                                        key={i}
                                        x1={padding}
                                        y1={padding + i * ((chartHeight - padding * 2) / 2)}
                                        x2={chartWidth - padding}
                                        y2={padding + i * ((chartHeight - padding * 2) / 2)}
                                        stroke="#334155"
                                        strokeDasharray="4,4"
                                        strokeWidth={1}
                                    />
                                ))}

                                {/* Area fill */}
                                <Path d={areaD} fill="url(#areaGradient)" />

                                {/* Line */}
                                <Path d={pathD} stroke="#3b82f6" strokeWidth={2} fill="none" />

                                {/* Forecast dashed line */}
                                <Line
                                    x1={points[points.length - 1].x}
                                    y1={points[points.length - 1].y}
                                    x2={chartWidth - padding + 20}
                                    y2={points[points.length - 1].y + (species.trend === 'down' ? 20 : -20)}
                                    stroke="#eab308"
                                    strokeWidth={2}
                                    strokeDasharray="4,4"
                                />

                                {/* Current point */}
                                <Circle
                                    cx={points[points.length - 1].x}
                                    cy={points[points.length - 1].y}
                                    r={5}
                                    fill="#eab308"
                                    stroke="white"
                                    strokeWidth={2}
                                />

                                {/* X-axis labels */}
                                {points.filter((_, i) => i % 2 === 0).map((p, i) => (
                                    <SvgText
                                        key={i}
                                        x={p.x}
                                        y={chartHeight + 15}
                                        fontSize={10}
                                        fill="#64748b"
                                        textAnchor="middle"
                                    >
                                        {p.date}
                                    </SvgText>
                                ))}
                            </Svg>

                            {/* Forecast tooltip */}
                            <View style={styles.forecastTooltip}>
                                <Text style={styles.tooltipDate}>12-16</Text>
                                <Text style={styles.tooltipForecast}>
                                    Forecast: {Math.round(species.price * (species.trend === 'down' ? 0.92 : 1.08))}
                                </Text>
                            </View>
                        </View>

                        {/* AI Forecast Card */}
                        <View style={styles.forecastCard}>
                            <View style={styles.forecastHeader}>
                                <View style={styles.forecastIconWrapper}>
                                    <Ionicons name="sparkles" size={20} color="#3b82f6" />
                                </View>
                                <Text style={styles.forecastTitle}>AI Market Forecast</Text>
                            </View>

                            {loadingForecast ? (
                                <ActivityIndicator color="#3b82f6" style={{ marginVertical: 16 }} />
                            ) : (
                                <Text style={styles.forecastText}>{forecast}</Text>
                            )}
                        </View>

                        {/* Trend and Target Cards */}
                        <View style={styles.statsRow}>
                            <View style={[
                                styles.statCard,
                                { backgroundColor: species.trend === 'up' ? '#052e16' : '#450a0a' }
                            ]}>
                                <Text style={styles.statLabel}>TREND</Text>
                                <View style={styles.statValueRow}>
                                    <Ionicons
                                        name={species.trend === 'up' ? 'trending-up' : 'trending-down'}
                                        size={18}
                                        color={species.trend === 'up' ? '#22c55e' : '#ef4444'}
                                    />
                                    <Text style={[
                                        styles.statValue,
                                        { color: species.trend === 'up' ? '#22c55e' : '#ef4444' }
                                    ]}>
                                        {species.trend === 'up' ? 'Bullish' : 'Bearish'}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.statCard, { backgroundColor: '#1e293b' }]}>
                                <Text style={styles.statLabel}>TARGET PRICE</Text>
                                <View style={styles.statValueRow}>
                                    <Ionicons
                                        name="analytics"
                                        size={18}
                                        color="#22c55e"
                                    />
                                    <Text style={[styles.statValue, { color: '#22c55e' }]}>
                                        ₹{Math.round(species.price * (species.trend === 'up' ? 1.16 : 0.84))}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Add to Cart Button */}
                        <TouchableOpacity
                            style={styles.addToCartBtn}
                            onPress={handleAddToCart}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="cart" size={20} color="white" />
                            <Text style={styles.addToCartText}>Add to Watchlist</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </MotiView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#0b0f19',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '85%',
        borderTopWidth: 1,
        borderColor: '#334155',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    speciesName: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
    },
    scientificName: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Outfit_400Regular',
        textTransform: 'uppercase',
    },
    closeBtn: {
        padding: 4,
        backgroundColor: '#1e293b',
        borderRadius: 20,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    priceLabel: {
        color: '#64748b',
        fontSize: 11,
        letterSpacing: 1,
        marginBottom: 4,
        fontFamily: 'Outfit_500Medium',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        color: 'white',
        fontSize: 36,
        fontFamily: 'Outfit_700Bold',
    },
    priceUnit: {
        color: '#64748b',
        fontSize: 16,
        marginLeft: 4,
    },
    trendBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    trendText: {
        fontSize: 13,
        fontFamily: 'Outfit_700Bold',
    },
    whatsappBtn: {
        backgroundColor: '#22c55e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        borderRadius: 14,
        marginBottom: 24,
    },
    whatsappText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    chartContainer: {
        backgroundColor: '#151b28',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        position: 'relative',
    },
    forecastTooltip: {
        position: 'absolute',
        right: 20,
        top: 60,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tooltipDate: {
        color: '#0b0f19',
        fontSize: 12,
        fontFamily: 'Outfit_700Bold',
    },
    tooltipForecast: {
        color: '#22c55e',
        fontSize: 11,
        fontFamily: 'Outfit_500Medium',
    },
    forecastCard: {
        backgroundColor: '#151b28',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    forecastHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    forecastIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#1e3a5f',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    forecastTitle: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    forecastText: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 22,
        fontFamily: 'Outfit_400Regular',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    statLabel: {
        color: '#64748b',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Outfit_700Bold',
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statValue: {
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    addToCartBtn: {
        backgroundColor: '#3b82f6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 20,
    },
    addToCartText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
});

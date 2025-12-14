import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { analyzeMarket, MarketAnalysis, RateData } from '@/services/ai';
import FloatingActions from '@/components/FloatingActions';

// Mock rates data
const MOCK_RATES: RateData[] = [
    { name: 'Seer Fish', price: 607, trend: 'down', trendPercentage: 12.79 },
    { name: 'Pomfret (Black)', price: 602, trend: 'down', trendPercentage: 10.81 },
    { name: 'Sardine', price: 141, trend: 'up', trendPercentage: 5.2 },
    { name: 'Mackerel', price: 230, trend: 'up', trendPercentage: 8.4 },
    { name: 'Prawns (Tiger)', price: 450, trend: 'down', trendPercentage: 2.1 },
];

export default function InsightsScreen() {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);
        setError(null);

        try {
            const result = await analyzeMarket(MOCK_RATES);
            setAnalysis(result);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (err) {
            setError('Failed to analyze market. Please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header with Harbour Selector */}
                    <View style={styles.locationRow}>
                        <View>
                            <Text style={styles.locationLabel}>CURRENT MARKET</Text>
                            <TouchableOpacity style={styles.locationSelector}>
                                <Ionicons name="location-sharp" size={16} color="#3b82f6" />
                                <Text style={styles.locationName}>Kochi Harbour</Text>
                                <Ionicons name="chevron-down" size={16} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.settingsBtn}>
                            <Text style={styles.settingsBtnText}>Settings</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Oracle Header Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 100 }}
                        style={styles.oracleCard}
                    >
                        <MotiView
                            from={{ rotate: '0deg' }}
                            animate={{ rotate: '360deg' }}
                            transition={{ type: 'timing', duration: 8000, loop: true }}
                            style={styles.sparkleWrapper}
                        >
                            <Ionicons name="sparkles" size={40} color="#eab308" />
                        </MotiView>
                        <Text style={styles.oracleTitle}>Market Oracle</Text>
                        <Text style={styles.oracleSubtitle}>
                            AI-powered analysis and daily predictions.
                        </Text>
                    </MotiView>

                    {/* Daily Analysis Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                        style={styles.analysisCard}
                    >
                        <View style={styles.analysisHeader}>
                            <View style={styles.analysisHeaderLeft}>
                                <Ionicons name="sparkles" size={20} color="#eab308" />
                                <Text style={styles.analysisTitle}>Daily Analysis</Text>
                            </View>
                            <View style={styles.aiBadge}>
                                <Text style={styles.aiBadgeText}>AI POWERED</Text>
                            </View>
                        </View>

                        <Text style={styles.analysisDesc}>
                            Get instant daily analysis on price trends, top movers, and buying opportunities.
                        </Text>

                        <TouchableOpacity
                            onPress={handleAnalyze}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <View style={styles.analyzeButton}>
                                {loading ? (
                                    <ActivityIndicator color="#0b0f19" />
                                ) : (
                                    <Text style={styles.analyzeButtonText}>Analyze Today's Market</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </MotiView>

                    {/* Analysis Results */}
                    {analysis && (
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={styles.resultsCard}
                        >
                            {/* Summary */}
                            <View style={styles.resultSection}>
                                <Text style={styles.resultSectionTitle}>📊 Market Summary</Text>
                                <Text style={styles.summaryText}>{analysis.summary}</Text>
                            </View>

                            {/* Top Gainers */}
                            <View style={styles.resultSection}>
                                <Text style={styles.resultSectionTitle}>📈 Top Gainers</Text>
                                {analysis.topGainers.map((item, i) => (
                                    <View key={i} style={styles.moverRow}>
                                        <Text style={styles.moverName}>{item.name}</Text>
                                        <Text style={[styles.moverChange, styles.gainText]}>{item.change}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Top Losers */}
                            <View style={styles.resultSection}>
                                <Text style={styles.resultSectionTitle}>📉 Top Losers</Text>
                                {analysis.topLosers.map((item, i) => (
                                    <View key={i} style={styles.moverRow}>
                                        <Text style={styles.moverName}>{item.name}</Text>
                                        <Text style={[styles.moverChange, styles.loseText]}>{item.change}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Recommendations */}
                            <View style={styles.resultSection}>
                                <Text style={styles.resultSectionTitle}>💡 Recommendations</Text>
                                {analysis.recommendations.map((rec, i) => (
                                    <Text key={i} style={styles.recText}>{rec}</Text>
                                ))}
                            </View>
                        </MotiView>
                    )}

                    {/* Error */}
                    {error && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={20} color="#ef4444" />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={handleAnalyze} style={styles.retryBtn}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>

            <FloatingActions />
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
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationLabel: {
        color: '#64748b',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 4,
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationName: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    settingsBtn: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsBtnText: {
        color: '#94a3b8',
        fontSize: 13,
    },
    oracleCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    sparkleWrapper: {
        marginBottom: 12,
    },
    oracleTitle: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    oracleSubtitle: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
    },
    analysisCard: {
        backgroundColor: '#151b28',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    analysisHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    analysisHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    analysisTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    aiBadge: {
        backgroundColor: '#1e40af',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    aiBadgeText: {
        color: '#93c5fd',
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
    },
    analysisDesc: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 20,
        fontFamily: 'Outfit_400Regular',
    },
    analyzeButton: {
        backgroundColor: 'white',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    analyzeButtonText: {
        color: '#0b0f19',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    resultsCard: {
        backgroundColor: '#151b28',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    resultSection: {
        marginBottom: 20,
    },
    resultSectionTitle: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 12,
    },
    summaryText: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 22,
        fontFamily: 'Outfit_400Regular',
    },
    moverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    moverName: {
        color: '#f8fafc',
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
    },
    moverChange: {
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
    },
    gainText: {
        color: '#22c55e',
    },
    loseText: {
        color: '#ef4444',
    },
    recText: {
        color: '#cbd5e1',
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Outfit_400Regular',
    },
    errorBox: {
        backgroundColor: '#450a0a',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        color: '#fca5a5',
        flex: 1,
        fontSize: 14,
    },
    retryBtn: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontFamily: 'Outfit_700Bold',
    },
});

import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import AppHeader from '@/components/AppHeader';
import { analyzeMarket, MarketAnalysis, RateData } from '@/services/ai';
import { DataService } from '@/services/data';

const HARBOURS = [
    'Kochi Harbour',
    'Vizag Fishing Harbour',
    'Mangalore Old Port',
    'Sassoon Dock',
    'Chennai Kasimedu',
    'Veraval Harbour',
    'Paradip Port'
];

const AI_LOADING_MESSAGES = [
    'Analyzing market trends...',
    'Processing price data...',
    'Evaluating supply patterns...',
    'Calculating predictions...',
    'Generating insights...',
];

export default function InsightsScreen() {
    const [selectedHarbour, setSelectedHarbour] = useState('Kochi Harbour');
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [analysisKey, setAnalysisKey] = useState(0);

    // State for Real Data
    const [currentRates, setCurrentRates] = useState<RateData[]>([]);
    const [fetchingData, setFetchingData] = useState(false);

    // Fetch Data when Harbour Changes
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            setFetchingData(true);
            try {
                // Fetch from our real database service
                const data = await DataService.getMarketData(selectedHarbour);

                if (isMounted) {
                    // Transform to RateData interface expected by AI service
                    const aiRates: RateData[] = data.map(item => ({
                        name: item.name,
                        price: item.price,
                        trend: item.trend,
                        trendPercentage: item.trendPercentage
                    }));
                    setCurrentRates(aiRates);
                }
            } catch (e) {
                console.error("Failed to fetch rates for analysis", e);
            } finally {
                if (isMounted) setFetchingData(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [selectedHarbour]);

    const handleHarbourChange = (harbour: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedHarbour(harbour);
        setShowPicker(false);
        setAnalysis(null);
        setError(null);
    };

    const handleAnalyze = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);
        setError(null);

        // Cycle through loading messages
        let msgIndex = 0;
        setLoadingMessage(AI_LOADING_MESSAGES[0]);
        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % AI_LOADING_MESSAGES.length;
            setLoadingMessage(AI_LOADING_MESSAGES[msgIndex]);
        }, 800);

        try {
            // Add minimum delay for better UX
            const [result] = await Promise.all([
                analyzeMarket(currentRates),
                new Promise(resolve => setTimeout(resolve, 2500)), // Min 2.5s loading
            ]);

            setAnalysis(result);
            setAnalysisKey(prev => prev + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (err) {
            setError('Failed to analyze market. Please try again.');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            clearInterval(msgInterval);
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
                    {/* App Header */}
                    <AppHeader />

                    {/* Harbour Selector */}
                    <TouchableOpacity
                        style={styles.harbourSelector}
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.harbourLeft}>
                            <Ionicons name="location" size={18} color="#3b82f6" />
                            <View>
                                <Text style={styles.harbourLabel}>ANALYZING MARKET</Text>
                                <Text style={styles.harbourName}>{selectedHarbour}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-down" size={20} color="#64748b" />
                    </TouchableOpacity>

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
                            <Ionicons name="sparkles" size={36} color="#eab308" />
                        </MotiView>
                        <Text style={styles.oracleTitle}>Market Oracle</Text>
                        <Text style={styles.oracleSubtitle}>
                            AI-powered analysis for {selectedHarbour.split(' ')[0]}
                        </Text>
                    </MotiView>

                    {/* Loading State */}
                    {loading && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.loadingCard}
                        >
                            <View style={styles.loadingContent}>
                                <MotiView
                                    from={{ rotate: '0deg' }}
                                    animate={{ rotate: '360deg' }}
                                    transition={{ type: 'timing', duration: 1500, loop: true }}
                                >
                                    <Ionicons name="sparkles" size={32} color="#eab308" />
                                </MotiView>
                                <View style={styles.loadingBars}>
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <MotiView
                                            key={i}
                                            from={{ scaleY: 0.3, opacity: 0.3 }}
                                            animate={{ scaleY: 1, opacity: 1 }}
                                            transition={{
                                                type: 'timing',
                                                duration: 400,
                                                delay: i * 100,
                                                loop: true,
                                            }}
                                            style={styles.loadingBar}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.loadingTitle}>AI Analyzing...</Text>
                                <Text style={styles.loadingMessage}>{loadingMessage}</Text>
                            </View>
                        </MotiView>
                    )}

                    {/* Daily Analysis Card */}
                    {!loading && (
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 200 }}
                            style={styles.analysisCard}
                        >
                            <View style={styles.analysisHeader}>
                                <View style={styles.analysisHeaderLeft}>
                                    <Ionicons name="sparkles" size={18} color="#eab308" />
                                    <Text style={styles.analysisTitle}>Daily Analysis</Text>
                                </View>
                                <View style={styles.aiBadge}>
                                    <Text style={styles.aiBadgeText}>GEMINI AI</Text>
                                </View>
                            </View>

                            <Text style={styles.analysisDesc}>
                                Get real-time AI analysis for {selectedHarbour} including price trends, top movers, and trading recommendations.
                            </Text>

                            <TouchableOpacity
                                onPress={handleAnalyze}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <View style={styles.analyzeButton}>
                                    <Ionicons name="sparkles" size={18} color="#0b0f19" />
                                    <Text style={styles.analyzeButtonText}>Analyze {selectedHarbour.split(' ')[0]} Market</Text>
                                </View>
                            </TouchableOpacity>
                        </MotiView>
                    )}

                    {/* Analysis Results */}
                    {analysis && !loading && (
                        <MotiView
                            key={analysisKey}
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={styles.resultsCard}
                        >
                            <View style={styles.resultsBadge}>
                                <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                                <Text style={styles.resultsBadgeText}>Analysis Complete</Text>
                            </View>

                            {/* Summary */}
                            <View style={styles.resultSection}>
                                <Text style={styles.resultSectionTitle}>📊 Market Summary</Text>
                                <Text style={styles.summaryText}>{analysis.summary}</Text>
                            </View>

                            {/* Top Gainers */}
                            {analysis.topGainers.length > 0 && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.resultSectionTitle}>📈 Top Gainers</Text>
                                    {analysis.topGainers.map((item, i) => (
                                        <View key={i} style={styles.moverRow}>
                                            <Text style={styles.moverName}>{item.name}</Text>
                                            <View style={styles.gainBadge}>
                                                <Text style={styles.gainText}>{item.change}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Top Losers */}
                            {analysis.topLosers.length > 0 && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.resultSectionTitle}>📉 Top Losers</Text>
                                    {analysis.topLosers.map((item, i) => (
                                        <View key={i} style={styles.moverRow}>
                                            <Text style={styles.moverName}>{item.name}</Text>
                                            <View style={styles.loseBadge}>
                                                <Text style={styles.loseText}>{item.change}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Recommendations */}
                            {analysis.recommendations.length > 0 && (
                                <View style={styles.resultSection}>
                                    <Text style={styles.resultSectionTitle}>💡 Recommendations</Text>
                                    {analysis.recommendations.map((rec, i) => (
                                        <View key={i} style={styles.recRow}>
                                            <Text style={styles.recBullet}>•</Text>
                                            <Text style={styles.recText}>{rec}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
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

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Harbour Picker Modal */}
            <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowPicker(false)} />
                    <MotiView
                        from={{ translateY: 300, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ type: 'timing', duration: 250 }}
                        style={styles.pickerModal}
                    >
                        <View style={styles.pickerHandle} />
                        <Text style={styles.pickerTitle}>Select Market to Analyze</Text>
                        {HARBOURS.map((harbour) => (
                            <TouchableOpacity
                                key={harbour}
                                style={[styles.pickerItem, harbour === selectedHarbour && styles.pickerItemSelected]}
                                onPress={() => handleHarbourChange(harbour)}
                            >
                                <Text style={[styles.pickerItemText, harbour === selectedHarbour && styles.pickerItemTextSelected]}>
                                    {harbour}
                                </Text>
                                {harbour === selectedHarbour && (
                                    <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </MotiView>
                </View>
            </Modal>
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
        padding: 16,
    },
    harbourSelector: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    harbourLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    harbourLabel: {
        color: '#64748b',
        fontSize: 9,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
    harbourName: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    oracleCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    sparkleWrapper: {
        marginBottom: 10,
    },
    oracleTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 6,
    },
    oracleSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
    },
    loadingCard: {
        backgroundColor: '#151b28',
        borderRadius: 16,
        padding: 32,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingBars: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 20,
        marginBottom: 16,
    },
    loadingBar: {
        width: 4,
        height: 24,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
    },
    loadingTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 6,
    },
    loadingMessage: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
    },
    analysisCard: {
        backgroundColor: '#151b28',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    analysisHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    analysisHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    analysisTitle: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    aiBadge: {
        backgroundColor: '#1e40af',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    aiBadgeText: {
        color: '#93c5fd',
        fontSize: 9,
        fontFamily: 'Outfit_700Bold',
    },
    analysisDesc: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 16,
        fontFamily: 'Outfit_400Regular',
    },
    analyzeButton: {
        backgroundColor: '#eab308',
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    analyzeButtonText: {
        color: '#0b0f19',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
    },
    resultsCard: {
        backgroundColor: '#151b28',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    resultsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#052e16',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 16,
    },
    resultsBadgeText: {
        color: '#22c55e',
        fontSize: 11,
        fontFamily: 'Outfit_700Bold',
    },
    resultSection: {
        marginBottom: 16,
    },
    resultSectionTitle: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 10,
    },
    summaryText: {
        color: '#cbd5e1',
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'Outfit_400Regular',
    },
    moverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    moverName: {
        color: '#f8fafc',
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
    },
    gainBadge: {
        backgroundColor: '#052e16',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    gainText: {
        color: '#22c55e',
        fontSize: 13,
        fontFamily: 'Outfit_700Bold',
    },
    loseBadge: {
        backgroundColor: '#450a0a',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    loseText: {
        color: '#ef4444',
        fontSize: 13,
        fontFamily: 'Outfit_700Bold',
    },
    recRow: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 16,
    },
    recBullet: {
        color: '#3b82f6',
        fontSize: 14,
        marginRight: 8,
        fontFamily: 'Outfit_700Bold',
    },
    recText: {
        color: '#cbd5e1',
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
        fontFamily: 'Outfit_400Regular',
    },
    errorBox: {
        backgroundColor: '#450a0a',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    errorText: {
        color: '#fca5a5',
        flex: 1,
        fontSize: 13,
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
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    pickerModal: {
        backgroundColor: '#1e293b',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: '#334155',
    },
    pickerHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#475569',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    pickerTitle: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 16,
    },
    pickerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 6,
        backgroundColor: '#0f172a',
    },
    pickerItemSelected: {
        backgroundColor: '#052e16',
        borderWidth: 1,
        borderColor: '#22c55e44',
    },
    pickerItemText: {
        color: '#f8fafc',
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
    },
    pickerItemTextSelected: {
        color: '#22c55e',
    },
});

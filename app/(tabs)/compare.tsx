import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import AppHeader from '@/components/AppHeader';

const HARBOURS = [
    'Kochi Harbour',
    'Vizag Fishing Harbour',
    'Mangalore Old Port',
    'Sassoon Dock',
    'Chennai Kasimedu',
];

// Mock harbour-specific prices
const HARBOUR_PRICES: Record<string, Record<string, number>> = {
    'Kochi Harbour': {
        'Sardine': 141, 'Mackerel': 230, 'Seer Fish': 607, 'Prawns': 386,
        'Tuna': 280, 'Pomfret': 602, 'Crab': 455, 'Red Snapper': 373,
        'Anchovies': 120, 'King Fish': 520,
    },
    'Vizag Fishing Harbour': {
        'Sardine': 118, 'Mackerel': 188, 'Seer Fish': 658, 'Prawns': 421,
        'Tuna': 262, 'Pomfret': 667, 'Crab': 398, 'Red Snapper': 342,
        'Anchovies': 95, 'King Fish': 485,
    },
    'Mangalore Old Port': {
        'Sardine': 155, 'Mackerel': 245, 'Seer Fish': 580, 'Prawns': 365,
        'Tuna': 295, 'Pomfret': 590, 'Crab': 478, 'Red Snapper': 398,
        'Anchovies': 132, 'King Fish': 548,
    },
    'Sassoon Dock': {
        'Sardine': 168, 'Mackerel': 268, 'Seer Fish': 695, 'Prawns': 425,
        'Tuna': 315, 'Pomfret': 720, 'Crab': 512, 'Red Snapper': 428,
        'Anchovies': 145, 'King Fish': 595,
    },
    'Chennai Kasimedu': {
        'Sardine': 125, 'Mackerel': 198, 'Seer Fish': 625, 'Prawns': 378,
        'Tuna': 248, 'Pomfret': 612, 'Crab': 435, 'Red Snapper': 352,
        'Anchovies': 108, 'King Fish': 498,
    },
};

const SPECIES = ['Sardine', 'Mackerel', 'Seer Fish', 'Prawns', 'Tuna', 'Pomfret', 'Crab', 'Red Snapper', 'Anchovies', 'King Fish'];

interface HarbourPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (harbour: string) => void;
    selected: string;
    exclude?: string;
    label: string;
    color: string;
}

function HarbourPicker({ visible, onClose, onSelect, selected, exclude, label, color }: HarbourPickerProps) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
                <MotiView
                    from={{ translateY: 300, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    transition={{ type: 'timing', duration: 250 }}
                    style={styles.pickerModal}
                >
                    <View style={styles.pickerHandle} />
                    <View style={styles.pickerHeader}>
                        <View style={[styles.pickerDot, { backgroundColor: color }]} />
                        <Text style={styles.pickerTitle}>{label}</Text>
                    </View>
                    {HARBOURS.filter(h => h !== exclude).map((harbour) => (
                        <TouchableOpacity
                            key={harbour}
                            style={[styles.pickerItem, harbour === selected && styles.pickerItemSelected]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onSelect(harbour);
                                onClose();
                            }}
                        >
                            <Text style={[styles.pickerItemText, harbour === selected && styles.pickerItemTextSelected]}>
                                {harbour}
                            </Text>
                            {harbour === selected && (
                                <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                            )}
                        </TouchableOpacity>
                    ))}
                </MotiView>
            </View>
        </Modal>
    );
}

export default function CompareScreen() {
    const [harbour1, setHarbour1] = useState('Kochi Harbour');
    const [harbour2, setHarbour2] = useState('Vizag Fishing Harbour');
    const [showPicker1, setShowPicker1] = useState(false);
    const [showPicker2, setShowPicker2] = useState(false);
    const [animKey, setAnimKey] = useState(0);

    const handleHarbour1Change = (h: string) => {
        setHarbour1(h);
        setAnimKey(prev => prev + 1);
    };

    const handleHarbour2Change = (h: string) => {
        setHarbour2(h);
        setAnimKey(prev => prev + 1);
    };

    // Calculate comparison data
    const comparisonData = useMemo(() => {
        const h1Prices = HARBOUR_PRICES[harbour1] || {};
        const h2Prices = HARBOUR_PRICES[harbour2] || {};

        return SPECIES.map(species => {
            const price1 = h1Prices[species] || 0;
            const price2 = h2Prices[species] || 0;
            const diff = price2 - price1;
            return {
                name: species,
                price1,
                price2,
                diff: Math.abs(diff),
                isHigherInH2: diff > 0,
            };
        });
    }, [harbour1, harbour2]);

    const swapHarbours = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const temp = harbour1;
        setHarbour1(harbour2);
        setHarbour2(temp);
        setAnimKey(prev => prev + 1);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* App Header */}
                    <AppHeader />

                    {/* Header Card */}
                    <View style={styles.headerCard}>
                        <View style={styles.headerCardIcon}>
                            <FontAwesome5 name="exchange-alt" size={24} color="#a78bfa" />
                        </View>
                        <Text style={styles.headerCardTitle}>Compare Markets</Text>
                        <Text style={styles.headerCardSubtitle}>
                            Check price differences between mandis
                        </Text>
                    </View>

                    {/* Compare Card */}
                    <View style={styles.compareCard}>
                        {/* First Harbour */}
                        <TouchableOpacity
                            style={styles.harbourSelector}
                            onPress={() => setShowPicker1(true)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.harbourLabelRow}>
                                <View style={[styles.harbourDot, { backgroundColor: '#3b82f6' }]} />
                                <Text style={styles.harbourLabel}>HARBOUR 1</Text>
                            </View>
                            <View style={styles.harbourValueRow}>
                                <Text style={styles.harbourText} numberOfLines={1}>{harbour1}</Text>
                                <Ionicons name="chevron-down" size={18} color="#64748b" />
                            </View>
                        </TouchableOpacity>

                        {/* Swap Button */}
                        <TouchableOpacity style={styles.swapBtn} onPress={swapHarbours}>
                            <FontAwesome5 name="exchange-alt" size={14} color="#a78bfa" style={{ transform: [{ rotate: '90deg' }] }} />
                        </TouchableOpacity>

                        {/* Second Harbour */}
                        <TouchableOpacity
                            style={styles.harbourSelector}
                            onPress={() => setShowPicker2(true)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.harbourLabelRow}>
                                <View style={[styles.harbourDot, { backgroundColor: '#22c55e' }]} />
                                <Text style={styles.harbourLabel}>HARBOUR 2</Text>
                            </View>
                            <View style={styles.harbourValueRow}>
                                <Text style={styles.harbourText} numberOfLines={1}>{harbour2}</Text>
                                <Ionicons name="chevron-down" size={18} color="#64748b" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Comparison Header */}
                    <View style={styles.comparisonHeader}>
                        <Text style={[styles.compHeaderText, { flex: 1.2, textAlign: 'left' }]}>Species</Text>
                        <Text style={styles.compHeaderText}>{harbour1.split(' ')[0]}</Text>
                        <Text style={styles.compHeaderText}>{harbour2.split(' ')[0]}</Text>
                        <Text style={[styles.compHeaderText, { flex: 0.8 }]}>Diff</Text>
                    </View>

                    {/* Comparison List with Animation */}
                    {comparisonData.map((item, index) => (
                        <MotiView
                            key={`${item.name}-${animKey}`}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ delay: index * 40 }}
                            style={styles.comparisonItem}
                        >
                            <View style={[styles.itemCell, { flex: 1.2 }]}>
                                <Text style={styles.itemNameText} numberOfLines={1}>{item.name}</Text>
                            </View>

                            <View style={styles.itemCell}>
                                <Text style={styles.priceText}>₹{item.price1}</Text>
                            </View>

                            <View style={styles.itemCell}>
                                <Text style={styles.priceText}>₹{item.price2}</Text>
                            </View>

                            <View style={[styles.itemCell, { flex: 0.8 }]}>
                                <View style={[
                                    styles.diffBadge,
                                    { backgroundColor: item.isHigherInH2 ? '#052e16' : '#450a0a' }
                                ]}>
                                    <Ionicons
                                        name={item.isHigherInH2 ? "arrow-up" : "arrow-down"}
                                        size={10}
                                        color={item.isHigherInH2 ? '#22c55e' : '#ef4444'}
                                    />
                                    <Text style={[
                                        styles.diffText,
                                        { color: item.isHigherInH2 ? '#22c55e' : '#ef4444' }
                                    ]}>
                                        {item.diff}
                                    </Text>
                                </View>
                            </View>
                        </MotiView>
                    ))}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Harbour Pickers */}
            <HarbourPicker
                visible={showPicker1}
                onClose={() => setShowPicker1(false)}
                onSelect={handleHarbour1Change}
                selected={harbour1}
                exclude={harbour2}
                label="Select Harbour 1"
                color="#3b82f6"
            />
            <HarbourPicker
                visible={showPicker2}
                onClose={() => setShowPicker2(false)}
                onSelect={handleHarbour2Change}
                selected={harbour2}
                exclude={harbour1}
                label="Select Harbour 2"
                color="#22c55e"
            />
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
    headerCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    headerCardIcon: {
        marginBottom: 10,
    },
    headerCardTitle: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 6,
    },
    headerCardSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
    },
    compareCard: {
        backgroundColor: '#1e293b',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    harbourSelector: {
        backgroundColor: '#0f172a',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    harbourLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    harbourDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    harbourLabel: {
        color: '#64748b',
        fontSize: 10,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
    harbourValueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    harbourText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        flex: 1,
    },
    swapBtn: {
        alignSelf: 'center',
        backgroundColor: '#0f172a',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: -6,
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#1e293b',
    },
    comparisonHeader: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 6,
    },
    compHeaderText: {
        flex: 1,
        color: '#64748b',
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
        textAlign: 'center',
    },
    comparisonItem: {
        backgroundColor: '#1e293b',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#334155',
    },
    itemCell: {
        flex: 1,
        alignItems: 'center',
    },
    itemNameText: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
        textAlign: 'left',
        width: '100%',
    },
    priceText: {
        color: '#f8fafc',
        fontSize: 13,
        fontFamily: 'Outfit_600SemiBold',
    },
    diffBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 2,
    },
    diffText: {
        fontSize: 11,
        fontFamily: 'Outfit_700Bold',
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
    pickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    pickerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    pickerTitle: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Outfit_700Bold',
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

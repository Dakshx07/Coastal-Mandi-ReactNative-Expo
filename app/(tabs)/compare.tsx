import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';

import FloatingActions from '@/components/FloatingActions';
import HarbourSelector from '@/components/HarbourSelector';

interface ComparisonItem {
    name: string;
    basePrice: number;
    diff: number;
    isUp: boolean;
}

const COMPARISON_DATA: ComparisonItem[] = [
    { name: 'Sardine', basePrice: 141, diff: 24, isUp: true },
    { name: 'Mackerel', basePrice: 230, diff: 42, isUp: true },
    { name: 'Seer Fish', basePrice: 607, diff: 51, isUp: false },
    { name: 'Prawns (Medium)', basePrice: 386, diff: 35, isUp: true },
    { name: 'Tuna', basePrice: 217, diff: 18, isUp: true },
    { name: 'Pomfret', basePrice: 602, diff: 65, isUp: false },
];

const HARBOURS = [
    'Kochi Harbour',
    'Vizag Fishing Harbour',
    'Mangalore Old Port',
    'Sassoon Dock',
    'Chennai Kasimedu',
];

export default function CompareScreen() {
    const [selectedHarbour, setSelectedHarbour] = useState('Kochi Harbour');
    const [harbour1, setHarbour1] = useState('Kochi Harbour');
    const [harbour2, setHarbour2] = useState('Vizag Fishing Harbour');
    const [expanded, setExpanded] = useState(true);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.logoCircle} />
                            <Text style={styles.logoText}>COASTAL MANDI</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.settingsBtn}
                            onPress={() => router.push('/(tabs)/settings')}
                        >
                            <Text style={styles.settingsBtnText}>Settings</Text>
                            <Image
                                source={{ uri: 'https://placehold.co/40x40/3b82f6/FFF?text=U' }}
                                style={styles.avatarSmall}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Harbour Selector */}
                    <HarbourSelector
                        selectedHarbour={selectedHarbour}
                        onSelect={setSelectedHarbour}
                    />

                    {/* Compare Markets Header Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 100 }}
                        style={styles.headerCard}
                    >
                        <View style={styles.headerCardIcon}>
                            <FontAwesome5 name="exchange-alt" size={28} color="#a78bfa" />
                        </View>
                        <Text style={styles.headerCardTitle}>Compare Markets</Text>
                        <Text style={styles.headerCardSubtitle}>
                            Check price differences between mandis instantly.
                        </Text>
                    </MotiView>

                    {/* Quick Compare Card */}
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 150 }}
                        style={styles.compareCard}
                    >
                        <TouchableOpacity
                            style={styles.cardHeader}
                            onPress={() => setExpanded(!expanded)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardHeaderLeft}>
                                <LinearGradient
                                    colors={['#8b5cf6', '#6366f1']}
                                    style={styles.iconBox}
                                >
                                    <FontAwesome5 name="exchange-alt" size={18} color="white" />
                                </LinearGradient>
                                <View>
                                    <Text style={styles.cardTitle}>Quick Compare</Text>
                                    <Text style={styles.cardSubtitle}>
                                        Check price differences instantly
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name={expanded ? "chevron-up" : "chevron-down"}
                                size={24}
                                color="#94a3b8"
                            />
                        </TouchableOpacity>

                        {expanded && (
                            <MotiView
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: 'timing', duration: 300 }}
                            >
                                {/* Harbour Selectors */}
                                <View style={styles.selectorSection}>
                                    {/* First Harbour */}
                                    <TouchableOpacity style={styles.harbourSelector}>
                                        <Text style={styles.harbourText}>{harbour1}</Text>
                                        <Ionicons name="chevron-down" size={20} color="#94a3b8" />
                                    </TouchableOpacity>

                                    <View style={styles.vsCircle}>
                                        <Text style={styles.vsText}>vs</Text>
                                    </View>

                                    {/* Second Harbour */}
                                    <TouchableOpacity style={styles.harbourSelector}>
                                        <Text style={styles.harbourText}>{harbour2}</Text>
                                        <Ionicons name="chevron-down" size={20} color="#94a3b8" />
                                    </TouchableOpacity>
                                </View>
                            </MotiView>
                        )}
                    </MotiView>

                    {/* Comparison List */}
                    {COMPARISON_DATA.map((item, index) => (
                        <MotiView
                            key={item.name}
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ delay: 200 + index * 50 }}
                            style={styles.comparisonItem}
                        >
                            <View style={styles.itemLeft}>
                                <View style={[
                                    styles.itemIndicator,
                                    { backgroundColor: item.isUp ? '#22c55e' : '#334155' }
                                ]} />
                                <Text style={styles.itemName}>{item.name}</Text>
                            </View>

                            <View style={styles.itemCenter}>
                                <Text style={styles.priceLabel}>Base</Text>
                                <Text style={styles.priceValue}>₹{item.basePrice}</Text>
                            </View>

                            <View style={styles.itemRight}>
                                <Text style={styles.priceLabel}>Diff</Text>
                                <Text style={[
                                    styles.diffValue,
                                    { color: item.isUp ? '#22c55e' : '#ef4444' }
                                ]}>
                                    {item.isUp ? '↗' : '↘'} ₹{item.diff}
                                </Text>
                            </View>
                        </MotiView>
                    ))}

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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
        fontSize: 16,
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
    },
    settingsBtnText: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    headerCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    headerCardIcon: {
        marginBottom: 12,
    },
    headerCardTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    headerCardSubtitle: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
    },
    compareCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    cardSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
        marginTop: 2,
        fontFamily: 'Outfit_400Regular',
    },
    selectorSection: {
        marginTop: 20,
        gap: 12,
    },
    harbourSelector: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    harbourText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
    },
    vsCircle: {
        alignSelf: 'center',
        backgroundColor: '#334155',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: -6,
        zIndex: 1,
    },
    vsText: {
        color: '#94a3b8',
        fontSize: 12,
        fontFamily: 'Outfit_700Bold',
    },
    comparisonItem: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    itemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    itemIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
    },
    itemName: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    itemCenter: {
        alignItems: 'center',
        marginRight: 24,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        color: '#64748b',
        fontSize: 11,
        marginBottom: 4,
        fontFamily: 'Outfit_500Medium',
    },
    priceValue: {
        color: '#f8fafc',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    diffValue: {
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
});

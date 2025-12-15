import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import AppHeader from '@/components/AppHeader';

interface Species {
    name: string;
    localName: string;
    price: number;
}

const SPECIES_LIST: Species[] = [
    { name: 'Seer Fish', localName: 'Neymeen / Surmai', price: 607 },
    { name: 'Pomfret (Black)', localName: 'Avoli / Halwa', price: 602 },
    { name: 'King Fish', localName: 'Ney Meen', price: 520 },
    { name: 'Crab', localName: 'Njandu / Kekda', price: 455 },
    { name: 'Prawns (Medium)', localName: 'Chemmeen', price: 386 },
    { name: 'Red Snapper', localName: 'Chempalli', price: 373 },
    { name: 'Tuna', localName: 'Choora', price: 280 },
    { name: 'Mackerel', localName: 'Ayala', price: 230 },
    { name: 'Sardine', localName: 'Mathi / Chaala', price: 141 },
    { name: 'Anchovies', localName: 'Netholi / Kozhuva', price: 120 },
];

export default function CalculatorScreen() {
    const [selectedSpecies, setSelectedSpecies] = useState<Species>(SPECIES_LIST[0]);
    const [quantity, setQuantity] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    const handleCalculate = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const qty = parseFloat(quantity) || 0;
        const total = qty * selectedSpecies.price;
        setResult(total);
    };

    const handleSelectSpecies = (species: Species) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedSpecies(species);
        setShowPicker(false);
        setResult(null);
    };

    const handleClear = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setQuantity('');
        setResult(null);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* App Header */}
                        <AppHeader />

                        {/* Header Card */}
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={styles.headerCard}
                        >
                            <View style={styles.iconBox}>
                                <FontAwesome5 name="calculator" size={24} color="#22c55e" />
                            </View>
                            <Text style={styles.headerTitle}>Catch Revenue</Text>
                            <Text style={styles.headerSubtitle}>
                                Estimate your earnings instantly
                            </Text>
                        </MotiView>

                        {/* Calculator Card */}
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 100 }}
                            style={styles.calcCard}
                        >
                            {/* Species Selector */}
                            <Text style={styles.label}>SELECT SPECIES</Text>
                            <TouchableOpacity
                                style={styles.selector}
                                onPress={() => setShowPicker(!showPicker)}
                                activeOpacity={0.8}
                            >
                                <View>
                                    <Text style={styles.selectorText} numberOfLines={1}>
                                        {selectedSpecies.name}
                                    </Text>
                                    <Text style={styles.selectorPrice}>₹{selectedSpecies.price}/kg</Text>
                                </View>
                                <Ionicons
                                    name={showPicker ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#64748b"
                                />
                            </TouchableOpacity>

                            {/* Species Picker Dropdown */}
                            {showPicker && (
                                <MotiView
                                    from={{ opacity: 0, scaleY: 0.8 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    style={styles.pickerContainer}
                                >
                                    <ScrollView
                                        style={{ maxHeight: 200 }}
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled
                                    >
                                        {SPECIES_LIST.map((species) => (
                                            <TouchableOpacity
                                                key={species.name}
                                                style={[
                                                    styles.pickerItem,
                                                    species.name === selectedSpecies.name && styles.pickerItemSelected,
                                                ]}
                                                onPress={() => handleSelectSpecies(species)}
                                            >
                                                <View>
                                                    <Text style={[
                                                        styles.pickerItemText,
                                                        species.name === selectedSpecies.name && styles.pickerItemTextSelected,
                                                    ]}>
                                                        {species.name}
                                                    </Text>
                                                    <Text style={styles.pickerItemPrice}>
                                                        {species.localName} • ₹{species.price}/kg
                                                    </Text>
                                                </View>
                                                {species.name === selectedSpecies.name && (
                                                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </MotiView>
                            )}

                            {/* Quantity Input */}
                            <Text style={styles.label}>QUANTITY (KG)</Text>
                            <View style={styles.inputRow}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter weight"
                                        placeholderTextColor="#64748b"
                                        value={quantity}
                                        onChangeText={(text) => {
                                            setQuantity(text.replace(/[^0-9.]/g, ''));
                                            setResult(null);
                                        }}
                                        keyboardType="decimal-pad"
                                        returnKeyType="done"
                                    />
                                    <Text style={styles.inputSuffix}>KG</Text>
                                </View>
                                {quantity ? (
                                    <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                                        <Ionicons name="close-circle" size={24} color="#64748b" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            {/* Calculate Button */}
                            <TouchableOpacity
                                style={styles.calculateBtn}
                                onPress={handleCalculate}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#22c55e', '#16a34a']}
                                    style={styles.calculateBtnGradient}
                                >
                                    <Ionicons name="calculator" size={20} color="white" />
                                    <Text style={styles.calculateBtnText}>Calculate Revenue</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </MotiView>

                        {/* Result Card */}
                        {result !== null && (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={styles.resultCard}
                            >
                                <View style={styles.resultHeader}>
                                    <Ionicons name="cash" size={22} color="#22c55e" />
                                    <Text style={styles.resultLabel}>ESTIMATED REVENUE</Text>
                                </View>
                                <Text style={styles.resultValue}>
                                    ₹{result.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </Text>
                                <View style={styles.resultBreakdown}>
                                    <Text style={styles.breakdownText}>
                                        {quantity} kg × ₹{selectedSpecies.price}/kg
                                    </Text>
                                </View>
                            </MotiView>
                        )}

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    headerCard: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#052e16',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#22c55e33',
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 6,
    },
    headerSubtitle: {
        color: '#94a3b8',
        fontSize: 14,
        fontFamily: 'Outfit_400Regular',
    },
    calcCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    label: {
        color: '#64748b',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Outfit_700Bold',
    },
    selector: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 16,
    },
    selectorText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_600SemiBold',
    },
    selectorPrice: {
        color: '#22c55e',
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
        marginTop: 2,
    },
    pickerContainer: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        marginTop: -10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
        overflow: 'hidden',
    },
    pickerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    pickerItemSelected: {
        backgroundColor: '#052e16',
    },
    pickerItemText: {
        color: '#f8fafc',
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
    },
    pickerItemTextSelected: {
        color: '#22c55e',
    },
    pickerItemPrice: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
        fontFamily: 'Outfit_400Regular',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1,
        borderColor: '#334155',
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
    },
    inputSuffix: {
        color: '#64748b',
        fontSize: 13,
        fontFamily: 'Outfit_700Bold',
    },
    clearBtn: {
        padding: 4,
    },
    calculateBtn: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    calculateBtnGradient: {
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    calculateBtnText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    resultCard: {
        backgroundColor: '#052e16',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#22c55e33',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    resultLabel: {
        color: '#22c55e',
        fontSize: 11,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
    resultValue: {
        color: 'white',
        fontSize: 38,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    resultBreakdown: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    breakdownText: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
});

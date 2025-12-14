import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Dimensions,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface CalculatorModalProps {
    visible: boolean;
    onClose: () => void;
}

interface Species {
    name: string;
    localName: string;
    price: number;
}

const SPECIES_LIST: Species[] = [
    { name: 'Seer Fish', localName: 'Neymeen / Surmai', price: 607 },
    { name: 'Pomfret (Black)', localName: 'Avoli / Halwa', price: 602 },
    { name: 'Crab', localName: 'Njandu / Kekda', price: 455 },
    { name: 'Prawns (Medium)', localName: 'Chemmeen', price: 386 },
    { name: 'Red Snapper', localName: 'Chempalli', price: 373 },
    { name: 'Mackerel', localName: 'Ayala', price: 230 },
    { name: 'Sardine', localName: 'Mathi / Chaala', price: 141 },
];

export default function CalculatorModal({ visible, onClose }: CalculatorModalProps) {
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

    const handleClose = () => {
        setQuantity('');
        setResult(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                <MotiView
                    from={{ opacity: 0, translateY: 100 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.modal}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.iconBox}>
                                <FontAwesome5 name="calculator" size={20} color="#22c55e" />
                            </View>
                            <View>
                                <Text style={styles.title}>Catch Revenue</Text>
                                <Text style={styles.subtitle}>Estimate your earnings instantly.</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    {/* Species Selector */}
                    <Text style={styles.label}>SELECT SPECIES</Text>
                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setShowPicker(!showPicker)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.selectorText}>
                            {selectedSpecies.name} ({selectedSpecies.localName}) - ₹{selectedSpecies.price}
                        </Text>
                        <Ionicons
                            name={showPicker ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#94a3b8"
                        />
                    </TouchableOpacity>

                    {/* Species Picker Dropdown */}
                    {showPicker && (
                        <MotiView
                            from={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 200 }}
                            style={styles.pickerContainer}
                        >
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {SPECIES_LIST.map((species) => (
                                    <TouchableOpacity
                                        key={species.name}
                                        style={[
                                            styles.pickerItem,
                                            species.name === selectedSpecies.name && styles.pickerItemSelected,
                                        ]}
                                        onPress={() => handleSelectSpecies(species)}
                                    >
                                        <Text style={[
                                            styles.pickerItemText,
                                            species.name === selectedSpecies.name && styles.pickerItemTextSelected,
                                        ]}>
                                            {species.name} ({species.localName}) - ₹{species.price}
                                        </Text>
                                        {species.name === selectedSpecies.name && (
                                            <Ionicons name="checkmark" size={18} color="#22c55e" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </MotiView>
                    )}

                    {/* Quantity Input */}
                    <Text style={styles.label}>QUANTITY (KG)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 50"
                            placeholderTextColor="#64748b"
                            value={quantity}
                            onChangeText={(text) => {
                                setQuantity(text);
                                setResult(null);
                            }}
                            keyboardType="numeric"
                        />
                        <Text style={styles.inputSuffix}>KG</Text>
                    </View>

                    {/* Calculate Button */}
                    <TouchableOpacity
                        style={styles.calculateBtn}
                        onPress={handleCalculate}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.calculateBtnText}>Calculate</Text>
                    </TouchableOpacity>

                    {/* Result */}
                    {result !== null && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.resultCard}
                        >
                            <Text style={styles.resultLabel}>ESTIMATED REVENUE</Text>
                            <Text style={styles.resultValue}>₹{result.toLocaleString('en-IN')}</Text>
                            <Text style={styles.resultBreakdown}>
                                {quantity} kg × ₹{selectedSpecies.price}/kg
                            </Text>
                        </MotiView>
                    )}
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
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: '#334155',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#052e16',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#22c55e',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
        marginTop: 2,
    },
    closeBtn: {
        padding: 4,
        backgroundColor: '#1e293b',
        borderRadius: 20,
    },
    label: {
        color: '#64748b',
        fontSize: 11,
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Outfit_700Bold',
    },
    selector: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 20,
    },
    selectorText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Outfit_500Medium',
        flex: 1,
    },
    pickerContainer: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        marginTop: -12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
        overflow: 'hidden',
    },
    pickerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    pickerItemSelected: {
        backgroundColor: '#0f172a',
    },
    pickerItemText: {
        color: '#f8fafc',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    pickerItemTextSelected: {
        color: '#22c55e',
    },
    inputWrapper: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
    },
    inputSuffix: {
        color: '#64748b',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
    },
    calculateBtn: {
        backgroundColor: '#1e293b',
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
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
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#22c55e33',
    },
    resultLabel: {
        color: '#22c55e',
        fontSize: 11,
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: 'Outfit_700Bold',
    },
    resultValue: {
        color: 'white',
        fontSize: 36,
        fontFamily: 'Outfit_700Bold',
    },
    resultBreakdown: {
        color: '#94a3b8',
        fontSize: 13,
        marginTop: 8,
        fontFamily: 'Outfit_400Regular',
    },
});

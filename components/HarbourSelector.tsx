import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface HarbourSelectorProps {
    selectedHarbour: string;
    onSelect: (harbour: string) => void;
}

const HARBOURS = [
    'Kochi Harbour',
    'Vizag Fishing Harbour',
    'Mangalore Old Port',
    'Sassoon Dock',
    'Chennai Kasimedu',
];

export default function HarbourSelector({ selectedHarbour, onSelect }: HarbourSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (harbour: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(harbour);
        setIsOpen(false);
    };

    return (
        <>
            {/* Selector Button */}
            <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsOpen(true);
                }}
                activeOpacity={0.8}
            >
                <View style={styles.selectorContent}>
                    <View style={styles.locationIcon}>
                        <Ionicons name="location-sharp" size={20} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={styles.label}>CURRENT MARKET</Text>
                        <View style={styles.valueRow}>
                            <Text style={styles.value}>{selectedHarbour}</Text>
                            <Ionicons
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#94a3b8"
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <MotiView
                        from={{ opacity: 0, translateY: -10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 200 }}
                        style={styles.dropdown}
                    >
                        {HARBOURS.map((harbour) => (
                            <TouchableOpacity
                                key={harbour}
                                style={[
                                    styles.option,
                                    harbour === selectedHarbour && styles.optionSelected,
                                ]}
                                onPress={() => handleSelect(harbour)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    harbour === selectedHarbour && styles.optionTextSelected,
                                ]}>
                                    {harbour}
                                </Text>
                                {harbour === selectedHarbour && (
                                    <Ionicons name="checkmark" size={20} color="#3b82f6" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </MotiView>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selector: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#334155',
    },
    selectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        color: '#64748b',
        fontSize: 10,
        letterSpacing: 1,
        marginBottom: 2,
        fontFamily: 'Outfit_500Medium',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    value: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        paddingTop: 160,
        paddingHorizontal: 20,
    },
    dropdown: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#334155',
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    optionSelected: {
        backgroundColor: '#0f172a',
    },
    optionText: {
        color: '#f8fafc',
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
    },
    optionTextSelected: {
        color: '#3b82f6',
        fontFamily: 'Outfit_700Bold',
    },
});

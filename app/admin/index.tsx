import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { AdminService } from '@/services/admin';
import { useUser } from '@/contexts/UserContext';
import { Logger } from '@/services/logger';
import * as Haptics from 'expo-haptics';

export default function AdminDashboard() {
    const { isGuest, user } = useUser(); // Added auth check
    const [harbours, setHarbours] = useState<any[]>([]);
    const [species, setSpecies] = useState<any[]>([]);
    const [selectedHarbour, setSelectedHarbour] = useState<string | null>(null);
    const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

    // Form State
    const [price, setPrice] = useState('');
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
    const [trendPct, setTrendPct] = useState('0');
    const [stock, setStock] = useState('available');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [h, s] = await Promise.all([
            AdminService.getAllHarbours(),
            AdminService.getAllSpecies()
        ]);
        setHarbours(h);
        setSpecies(s);
    };

    const handleSubmit = async () => {
        if (!selectedHarbour || !selectedSpecies || !price) {
            Alert.alert('Error', 'Please select Harbour, Fish, and Price');
            return;
        }

        setIsSubmitting(true);
        const result = await AdminService.updateDailyPrice(
            selectedHarbour,
            selectedSpecies,
            parseFloat(price),
            trend,
            parseFloat(trendPct),
            stock
        );
        setIsSubmitting(false);

        if (result.success) {
            Alert.alert('Success', 'Price Updated Successfully!');
            setPrice('');
            setTrendPct('0');
        } else {
            Alert.alert('Error', 'Update Failed. Check logs.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
                        <Ionicons name="home" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Admin Panel</Text>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.content}>

                        {/* 1. Select Harbour */}
                        <Text style={styles.sectionTitle}>1. Select Harbour</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                            {harbours.map(h => (
                                <TouchableOpacity
                                    key={h.id}
                                    style={[styles.chip, selectedHarbour === h.id && styles.chipActive]}
                                    onPress={() => setSelectedHarbour(h.id)}
                                >
                                    <Text style={[styles.chipText, selectedHarbour === h.id && styles.chipTextActive]}>
                                        {h.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* 2. Select Fish */}
                        <Text style={styles.sectionTitle}>2. Select Species</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                            {species.map(s => (
                                <TouchableOpacity
                                    key={s.id}
                                    style={[styles.chip, selectedSpecies === s.id && styles.chipActive]}
                                    onPress={() => setSelectedSpecies(s.id)}
                                >
                                    <Text style={[styles.chipText, selectedSpecies === s.id && styles.chipTextActive]}>
                                        {s.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* 3. Enter Data */}
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>Price (₹/kg)</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                                placeholder="e.g. 600"
                                placeholderTextColor="#64748b"
                            />

                            <Text style={styles.label}>Trend (%)</Text>
                            <View style={styles.trendRow}>
                                <TouchableOpacity
                                    style={[styles.trendBtn, trend === 'up' && { backgroundColor: Colors.premium.green }]}
                                    onPress={() => setTrend('up')}
                                >
                                    <Ionicons name="trending-up" size={20} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.trendBtn, trend === 'stable' && { backgroundColor: Colors.premium.gold }]}
                                    onPress={() => setTrend('stable')}
                                >
                                    <Ionicons name="remove" size={20} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.trendBtn, trend === 'down' && { backgroundColor: Colors.premium.red }]}
                                    onPress={() => setTrend('down')}
                                >
                                    <Ionicons name="trending-down" size={20} color="white" />
                                </TouchableOpacity>

                                <TextInput
                                    style={[styles.input, { flex: 1, marginLeft: 10 }]}
                                    keyboardType="numeric"
                                    value={trendPct}
                                    onChangeText={setTrendPct}
                                    placeholder="%"
                                    placeholderTextColor="#64748b"
                                />
                            </View>

                            {/* Submit */}
                            <TouchableOpacity
                                style={styles.submitBtnLarge}
                                onPress={() => {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    handleSubmit();
                                }}
                                disabled={isSubmitting}
                            >
                                <Ionicons name="checkmark-circle" size={28} color="white" />
                                <Text style={styles.submitTextLarge}>
                                    {isSubmitting ? 'UPDATING...' : 'UPDATE PRICE'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.premium.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.premium.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        padding: 8,
        marginRight: 12,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        color: Colors.premium.textDim,
        marginTop: 20,
        marginBottom: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollRow: {
        marginBottom: 10,
        maxHeight: 50,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.premium.card,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.premium.border,
    },
    chipActive: {
        backgroundColor: Colors.premium.primary,
        borderColor: Colors.premium.primary,
    },
    chipText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
    chipTextActive: {
        color: 'white',
    },
    formContainer: {
        marginTop: 30,
        backgroundColor: Colors.premium.card,
        padding: 20,
        borderRadius: 16,
    },
    label: {
        color: '#94a3b8',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: Colors.premium.border,
        borderRadius: 8,
        padding: 12,
        color: 'white',
        fontSize: 16,
        marginBottom: 16,
    },
    trendRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    trendBtn: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    submitBtnLarge: {
        backgroundColor: Colors.premium.primary,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        shadowColor: Colors.premium.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        marginTop: 10,
    },
    submitTextLarge: {
        color: 'white',
        fontWeight: '900', // Extra Bold
        fontSize: 18,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
});

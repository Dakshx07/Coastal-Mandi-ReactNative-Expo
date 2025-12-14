import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import FloatingActions from '@/components/FloatingActions';
import HarbourSelector from '@/components/HarbourSelector';

interface CartItem {
    id: string;
    name: string;
    scientificName: string;
    price: number;
    trend: 'up' | 'down';
    trendPercentage: number;
    imageUrl: string;
}

export default function CartScreen() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedHarbour, setSelectedHarbour] = useState('Kochi Harbour');

    const removeItem = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCart(cart.filter(item => item.id !== id));
    };

    const clearAll = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'Clear Watchlist',
            'Are you sure you want to remove all items?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => setCart([]) },
            ]
        );
    };

    const sendWhatsApp = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (cart.length === 0) {
            Alert.alert('Empty Cart', 'Add items to your watchlist first.');
            return;
        }

        const message = `🐟 *Coastal Mandi Order*\n\n${cart.map(item =>
            `• ${item.name} - ₹${item.price}/kg`
        ).join('\n')}\n\n📍 ${selectedHarbour}\n📅 ${new Date().toLocaleDateString()}`;

        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(whatsappUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(whatsappUrl);
                } else {
                    Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share your order.');
                }
            });
    };

    const navigateToRates = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(tabs)');
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            style={styles.cartItem}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

            <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.scientificName}</Text>
            </View>

            <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={[
                    styles.itemTrend,
                    { color: item.trend === 'down' ? '#ef4444' : '#22c55e' }
                ]}>
                    {item.trend === 'down' ? '↓' : '↑'} {item.trendPercentage}%
                </Text>
            </View>

            <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(item.id)}
            >
                <Ionicons name="close" size={20} color="#ef4444" />
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
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
                <View style={styles.harbourWrapper}>
                    <HarbourSelector
                        selectedHarbour={selectedHarbour}
                        onSelect={setSelectedHarbour}
                    />
                </View>

                {/* Cart Header Card */}
                <View style={styles.cartHeaderCard}>
                    <View style={styles.cartIconWrapper}>
                        <Ionicons name="cart" size={32} color="#22c55e" />
                    </View>
                    <Text style={styles.cartTitle}>My Watchlist</Text>
                    <Text style={styles.cartSubtitle}>
                        Track your favorite species for quick access
                    </Text>
                </View>

                {/* Cart Items or Empty State */}
                {cart.length > 0 ? (
                    <>
                        {/* Order Section Header */}
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderHeaderText}>YOUR ORDER</Text>
                            <TouchableOpacity onPress={clearAll}>
                                <View style={styles.clearAllBtn}>
                                    <Ionicons name="trash-outline" size={14} color="#94a3b8" />
                                    <Text style={styles.clearAllText}>Clear All</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* WhatsApp Button */}
                        <TouchableOpacity
                            style={styles.whatsappBtn}
                            activeOpacity={0.8}
                            onPress={sendWhatsApp}
                        >
                            <FontAwesome5 name="whatsapp" size={20} color="white" />
                            <Text style={styles.whatsappText}>Send Order via WhatsApp</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={cart}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                ) : (
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIconWrapper}>
                            <Ionicons name="cart-outline" size={48} color="#64748b" />
                        </View>
                        <Text style={styles.emptyTitle}>Cart is Empty</Text>
                        <Text style={styles.emptySubtext}>
                            Add species to your cart by tapping the + button on any species card.
                        </Text>
                        <TouchableOpacity
                            style={styles.browseBtn}
                            onPress={navigateToRates}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.browseBtnText}>Browse Rates</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
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
    harbourWrapper: {
        marginBottom: 16,
    },
    cartHeaderCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cartIconWrapper: {
        marginBottom: 12,
    },
    cartTitle: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    cartSubtitle: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Outfit_400Regular',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderHeaderText: {
        color: '#94a3b8',
        fontSize: 12,
        letterSpacing: 1,
        fontFamily: 'Outfit_700Bold',
    },
    clearAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    clearAllText: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    whatsappBtn: {
        backgroundColor: '#22c55e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    whatsappText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    listContent: {
        paddingBottom: 120,
    },
    cartItem: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#334155',
    },
    itemContent: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    itemSubtitle: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'Outfit_400Regular',
    },
    itemRight: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    itemPrice: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
    },
    itemTrend: {
        fontSize: 13,
        fontFamily: 'Outfit_500Medium',
    },
    removeBtn: {
        padding: 8,
        backgroundColor: '#450a0a',
        borderRadius: 10,
    },
    emptyCard: {
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    emptyIconWrapper: {
        marginBottom: 16,
    },
    emptyTitle: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#64748b',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        fontFamily: 'Outfit_400Regular',
    },
    browseBtn: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    browseBtnText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
    },
});

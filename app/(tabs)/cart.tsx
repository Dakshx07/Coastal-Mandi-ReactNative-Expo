import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    Linking,
    Share,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import { useCart, CartItem } from '@/contexts/CartContext';

export default function CartScreen() {
    const { items, removeItem, clearCart } = useCart();

    const handleRemove = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        removeItem(id);
    };

    const handleClearAll = () => {
        if (items.length === 0) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'Clear Watchlist',
            'Are you sure you want to remove all items?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]
        );
    };

    const shareWatchlist = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (items.length === 0) {
            Alert.alert('Empty Watchlist', 'Add species to your watchlist first.');
            return;
        }

        const message = `🐟 *Coastal Mandi Watchlist*\n\n${items.map(item =>
            `• ${item.name} - ₹${item.price}/kg (${item.harbour})`
        ).join('\n')}\n\n📅 ${new Date().toLocaleDateString()}\n\n🌊 Get live fish prices at Coastal Mandi`;

        try {
            // Use Share API which works reliably on iOS
            await Share.share({
                message: message,
                title: 'Coastal Mandi Watchlist',
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const navigateToRates = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/(tabs)');
    };

    const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 50 }}
            style={styles.cartItem}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

            <View style={styles.itemContent}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>{item.scientificName}</Text>
                <View style={styles.harbourBadge}>
                    <Ionicons name="location" size={10} color="#3b82f6" />
                    <Text style={styles.harbourBadgeText}>{item.harbour.split(' ')[0]}</Text>
                </View>
            </View>

            <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={[
                    styles.itemTrend,
                    { color: item.trend === 'down' ? '#ef4444' : '#22c55e' }
                ]}>
                    {item.trend === 'down' ? '↓' : '↑'} {item.trendPercentage.toFixed(1)}%
                </Text>
            </View>

            <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item.id)}
            >
                <Ionicons name="close" size={18} color="#ef4444" />
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.content}>
                    {/* App Header */}
                    <AppHeader />

                    {/* Watchlist Header Card */}
                    <View style={styles.headerCard}>
                        <View style={styles.headerIconWrapper}>
                            <Ionicons name="heart" size={28} color="#ef4444" />
                        </View>
                        <Text style={styles.headerTitle}>My Watchlist</Text>
                        <Text style={styles.headerSubtitle}>
                            {items.length > 0
                                ? `${items.length} species saved`
                                : 'Track your favorite species for quick access'
                            }
                        </Text>
                    </View>

                    {/* Cart Items or Empty State */}
                    {items.length > 0 ? (
                        <>
                            {/* Actions Row */}
                            <View style={styles.actionsRow}>
                                <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
                                    <Ionicons name="trash-outline" size={14} color="#94a3b8" />
                                    <Text style={styles.clearBtnText}>Clear All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Share Button - Uses native Share API */}
                            <TouchableOpacity
                                style={styles.shareBtn}
                                activeOpacity={0.8}
                                onPress={shareWatchlist}
                            >
                                <Ionicons name="share-outline" size={18} color="white" />
                                <Text style={styles.shareBtnText}>Share Watchlist</Text>
                            </TouchableOpacity>

                            <FlatList
                                data={items}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        </>
                    ) : (
                        <View style={styles.emptyCard}>
                            <View style={styles.emptyIconWrapper}>
                                <Ionicons name="heart-outline" size={48} color="#64748b" />
                            </View>
                            <Text style={styles.emptyTitle}>Watchlist is Empty</Text>
                            <Text style={styles.emptySubtext}>
                                Tap the + button on any species card to add it to your watchlist.
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
                </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 16,
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
    headerIconWrapper: {
        marginBottom: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 6,
    },
    headerSubtitle: {
        color: '#94a3b8',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#1e293b',
        borderRadius: 8,
    },
    clearBtnText: {
        color: '#94a3b8',
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
    },
    shareBtn: {
        backgroundColor: '#3b82f6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 16,
    },
    shareBtnText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Outfit_700Bold',
    },
    listContent: {
        paddingBottom: 100,
    },
    cartItem: {
        backgroundColor: '#1e293b',
        borderRadius: 14,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    itemImage: {
        width: 54,
        height: 54,
        borderRadius: 10,
        backgroundColor: '#334155',
    },
    itemContent: {
        flex: 1,
        marginLeft: 10,
    },
    itemName: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
    },
    itemSubtitle: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
        fontFamily: 'Outfit_400Regular',
    },
    harbourBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        backgroundColor: '#0f172a',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    harbourBadgeText: {
        color: '#3b82f6',
        fontSize: 10,
        fontFamily: 'Outfit_500Medium',
    },
    itemRight: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    itemPrice: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Outfit_700Bold',
    },
    itemTrend: {
        fontSize: 11,
        fontFamily: 'Outfit_600SemiBold',
        marginTop: 2,
    },
    removeBtn: {
        padding: 8,
        backgroundColor: '#450a0a',
        borderRadius: 8,
    },
    emptyCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    emptyIconWrapper: {
        marginBottom: 14,
    },
    emptyTitle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Outfit_700Bold',
        marginBottom: 8,
    },
    emptySubtext: {
        color: '#64748b',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        fontFamily: 'Outfit_400Regular',
    },
    browseBtn: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    browseBtnText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Outfit_700Bold',
    },
});

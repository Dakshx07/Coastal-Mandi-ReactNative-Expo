import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';

import AppHeader from '@/components/AppHeader';
import SpeciesCard from '@/components/SpeciesCard';
import HarbourSelector from '@/components/HarbourSelector';
import FishDetailModal from '@/components/FishDetailModal';
import WeatherHeader from '@/components/WeatherHeader';
import WhatsAppModal from '@/components/WhatsAppModal';
import { useCart } from '@/contexts/CartContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SpeciesData {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  trend: 'up' | 'down';
  trendPercentage: number;
  imageUrl: string;
  trustScore?: number;
}

// Weather data per harbour (Static for now)
const WEATHER_DATA: Record<string, { temp: number; condition: string; wind: number; humidity: number }> = {
  'Kochi Harbour': { temp: 29, condition: 'Humid', wind: 14, humidity: 78 },
  'Vizag Fishing Harbour': { temp: 31, condition: 'Sunny', wind: 18, humidity: 65 },
  'Mangalore Old Port': { temp: 28, condition: 'Cloudy', wind: 12, humidity: 82 },
  'Sassoon Dock': { temp: 32, condition: 'Hot', wind: 8, humidity: 55 },
  'Chennai Kasimedu': { temp: 33, condition: 'Warm', wind: 16, humidity: 70 },
  'Veraval Harbour': { temp: 34, condition: 'Sunny', wind: 20, humidity: 45 },
  'Paradip Port': { temp: 30, condition: 'Windy', wind: 25, humidity: 75 },
};

// Fallback Data (used if API fails or empty)
const FALLBACK_SPECIES = [
  { id: 'f1', name: 'Seer Fish', scientificName: 'Neymeen', price: 600, trend: 'up', trendPercentage: 5, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200' },
  { id: 'f2', name: 'Mackerel', scientificName: 'Ayala', price: 220, trend: 'down', trendPercentage: 2, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200' },
  { id: 'f3', name: 'Sardine', scientificName: 'Mathi', price: 140, trend: 'up', trendPercentage: 8, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200' },
  { id: 'f4', name: 'Pomfret (Black)', scientificName: 'Avoli', price: 580, trend: 'down', trendPercentage: 4, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200' },
  { id: 'f5', name: 'Prawns', scientificName: 'Chemmeen', price: 420, trend: 'up', trendPercentage: 12, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200' },
  { id: 'f6', name: 'Tuna', scientificName: 'Choora', price: 280, trend: 'stable', trendPercentage: 0, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200' },
  { id: 'f7', name: 'Red Snapper', scientificName: 'Chempalli', price: 390, trend: 'up', trendPercentage: 6, imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200' },
  { id: 'f8', name: 'Crab', scientificName: 'Njandu', price: 450, trend: 'down', trendPercentage: 3, imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200' },
];

import { DataService } from '@/services/data';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedHarbour, setSelectedHarbour] = useState('Kochi Harbour');
  const [selectedFish, setSelectedFish] = useState<SpeciesData | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Data States
  const [marketData, setMarketData] = useState<SpeciesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [crossHarbourData, setCrossHarbourData] = useState<Record<string, any> | null>(null);
  const [searchedFishName, setSearchedFishName] = useState<string | null>(null);

  const searchInputRef = useRef<TextInput>(null);
  const cart = useCart();

  // Fetch Market Data when Harbour changes
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const data = await DataService.getMarketData(selectedHarbour);

      if (isMounted) {
        if (data && data.length > 0) {
          setMarketData(data);
        } else {
          // Fallback if no data found (e.g. database empty)
          setMarketData(FALLBACK_SPECIES as any);
        }
        setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [selectedHarbour]);

  // Search & Cross Harbour Logic
  useEffect(() => {
    if (searchQuery.length < 3) {
      setCrossHarbourData(null);
      setSearchedFishName(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      // 1. Try to find a matching species name in our current list or API
      // For simplicity, finding match in current ID list or partial name
      const found = marketData.find(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (found) {
        setSearchedFishName(found.name);
        // 2. Fetch cross-harbour prices
        const prices = await DataService.getCrossHarbourPrices(found.name);
        setCrossHarbourData(prices);
      }
      setIsSearching(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, marketData]);


  // Ticker animation
  const tickerAnim = useRef(new Animated.Value(0)).current;
  const TICKER_WIDTH = marketData.length * 170;

  useEffect(() => {
    tickerAnim.setValue(0);
    if (marketData.length > 0) {
      Animated.loop(
        Animated.timing(tickerAnim, {
          toValue: -TICKER_WIDTH,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [selectedHarbour, marketData.length]);

  const weather = WEATHER_DATA[selectedHarbour] || WEATHER_DATA['Kochi Harbour'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const handleHarbourChange = (harbour: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedHarbour(harbour);
  };

  const handleFishPress = (fish: SpeciesData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFish(fish);
    setShowDetail(true);
  };

  const handleAddToCart = (fish: SpeciesData) => {
    cart.addItem({
      name: fish.name,
      scientificName: fish.scientificName,
      price: fish.price,
      trend: fish.trend,
      trendPercentage: fish.trendPercentage,
      imageUrl: fish.imageUrl,
      harbour: selectedHarbour,
    });
  };

  // Filter for local search
  const filteredData = marketData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* Fixed Header Section (AppHeader & Selector) */}
          <View style={styles.fixedHeader}>
            <AppHeader />
            <View style={styles.topControls}>
              <HarbourSelector selectedHarbour={selectedHarbour} onSelect={handleHarbourChange} />
            </View>
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            removeClippedSubviews={false}
            renderItem={({ item, index }) => (
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: index * 30 }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleFishPress(item)}
                >
                  <SpeciesCard
                    id={item.id}
                    name={item.name}
                    scientificName={item.scientificName}
                    price={item.price}
                    trend={item.trend}
                    trendPercentage={item.trendPercentage}
                    imageUrl={item.imageUrl}
                    trustScore={item.trustScore}
                    onAddToCart={() => handleAddToCart(item)}
                    isInCart={cart.items.some(i => i.name === item.name && i.harbour === selectedHarbour)}
                  />
                </TouchableOpacity>
              </MotiView>
            )}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View>
                {/* Weather Header Moved Here */}
                <WeatherHeader
                  harbour={selectedHarbour}
                  weather={weather}
                  today={today}
                  speciesCount={filteredData.length}
                />

                {/* Search Bar Moved Below Weather */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={18} color="#94a3b8" />
                  <TextInput
                    ref={searchInputRef}
                    placeholder="Search species..."
                    placeholderTextColor="#64748b"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      setIsSearching(true);
                      setTimeout(() => setIsSearching(false), 500); // Fake loader
                    }}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                    blurOnSubmit={false}
                    selectionColor="#3b82f6"
                  />
                  {isSearching ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : searchQuery.length > 0 ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close-circle" size={18} color="#64748b" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Cross Harbour Card (only when searching) */}
                {crossHarbourData && (
                  <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={styles.crossHarbourCard}
                  >
                    {/* ... (Cross Harbour Content) ... */}
                    <View style={styles.crossHarbourHeader}>
                      <Ionicons name="location" size={16} color={Colors.premium.gold} />
                      <Text style={styles.crossHarbourTitle}>PRICES ACROSS ALL HARBOURS</Text>
                    </View>
                    <View style={styles.crossHarbourFishRow}>
                      <FontAwesome5 name="fish" size={14} color={Colors.premium.gold} />
                      <Text style={styles.crossHarbourFishName}>{searchedFishName}</Text>
                    </View>
                    <View style={styles.crossHarbourGrid}>
                      {Object.entries(crossHarbourData).map(([harbour, data]) => (
                        <TouchableOpacity
                          key={harbour}
                          style={[
                            styles.harbourPriceCard,
                            harbour === selectedHarbour && styles.harbourPriceCardActive,
                          ]}
                          onPress={() => handleHarbourChange(harbour)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.harbourPriceName} numberOfLines={1}>
                            {harbour.split(' ')[0].toUpperCase()}
                          </Text>
                          <Text style={styles.harbourPriceValue}>₹{data.price}</Text>
                          <Text style={[
                            styles.harbourPriceTrend,
                            { color: data.trend === 'down' ? Colors.premium.red : Colors.premium.green }
                          ]}>
                            {data.trend === 'down' ? '↓' : '↑'} {data.trendPercentage}%
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </MotiView>
                )}
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>

        {/* Fish Detail Modal */}
        <FishDetailModal
          visible={showDetail}
          species={selectedFish}
          onClose={() => setShowDetail(false)}
          onAddToCart={handleAddToCart}
        />

        {/* WhatsApp Modal */}
        <WhatsAppModal visible={showWhatsApp} onClose={() => setShowWhatsApp(false)} />
      </View>
    </TouchableWithoutFeedback>
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  fixedHeader: {
    paddingBottom: 8,
    backgroundColor: Colors.premium.background,
    zIndex: 10,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.premium.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.premium.border,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.premium.text,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
  },
  crossHarbourCard: {
    backgroundColor: Colors.premium.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.premium.border,
    marginHorizontal: 16,
  },
  crossHarbourHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  crossHarbourTitle: {
    color: Colors.premium.textDim,
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'Outfit_700Bold',
  },
  crossHarbourFishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  crossHarbourFishName: {
    color: Colors.premium.text,
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    marginBottom: 2,
  },
  crossHarbourFishSub: {
    color: Colors.premium.textDim,
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
  },
  crossHarbourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subscribeBtn: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  subscribeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  harbourPriceCard: {
    backgroundColor: '#020617', // Darker than card
    borderRadius: 10,
    padding: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.premium.border,
    marginBottom: 8,
  },
  harbourPriceCardActive: {
    borderColor: Colors.premium.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  harbourPriceName: {
    color: Colors.premium.textDim,
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 4,
  },
  harbourPriceValue: {
    color: Colors.premium.text,
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
  },
  harbourPriceTrend: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    marginTop: 2,
  },
});

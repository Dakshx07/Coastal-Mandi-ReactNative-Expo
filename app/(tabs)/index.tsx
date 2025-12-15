import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import AppHeader from '@/components/AppHeader';
import SpeciesCard from '@/components/SpeciesCard';
import HarbourSelector from '@/components/HarbourSelector';
import FishDetailModal from '@/components/FishDetailModal';
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

// Weather data per harbour
const WEATHER_DATA: Record<string, { temp: number; condition: string; wind: number; humidity: number }> = {
  'Kochi Harbour': { temp: 29, condition: 'Humid', wind: 14, humidity: 78 },
  'Vizag Fishing Harbour': { temp: 31, condition: 'Sunny', wind: 18, humidity: 65 },
  'Mangalore Old Port': { temp: 28, condition: 'Cloudy', wind: 12, humidity: 82 },
  'Sassoon Dock': { temp: 32, condition: 'Hot', wind: 8, humidity: 55 },
  'Chennai Kasimedu': { temp: 33, condition: 'Warm', wind: 16, humidity: 70 },
};

// Species data per harbour with their own prices
const HARBOUR_SPECIES: Record<string, SpeciesData[]> = {
  'Kochi Harbour': [
    { id: 'k1', name: 'Seer Fish', scientificName: 'Neymeen / Surmai', price: 607, trend: 'down', trendPercentage: 12.79, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 95 },
    { id: 'k2', name: 'Pomfret (Black)', scientificName: 'Avoli / Halwa', price: 602, trend: 'down', trendPercentage: 10.81, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 95 },
    { id: 'k3', name: 'Crab', scientificName: 'Njandu / Kekda', price: 455, trend: 'up', trendPercentage: 3.2, imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200', trustScore: 92 },
    { id: 'k4', name: 'Prawns (Medium)', scientificName: 'Chemmeen', price: 386, trend: 'down', trendPercentage: 0.52, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200', trustScore: 90 },
    { id: 'k5', name: 'Red Snapper', scientificName: 'Chempalli', price: 373, trend: 'up', trendPercentage: 1.08, imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200', trustScore: 88 },
    { id: 'k6', name: 'Tuna', scientificName: 'Choora', price: 280, trend: 'up', trendPercentage: 4.5, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 91 },
    { id: 'k7', name: 'Mackerel', scientificName: 'Ayala', price: 230, trend: 'up', trendPercentage: 8.4, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 93 },
    { id: 'k8', name: 'Sardine', scientificName: 'Mathi / Chaala', price: 141, trend: 'up', trendPercentage: 5.2, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200', trustScore: 94 },
    { id: 'k9', name: 'Anchovies', scientificName: 'Netholi / Kozhuva', price: 120, trend: 'up', trendPercentage: 2.8, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 89 },
    { id: 'k10', name: 'King Fish', scientificName: 'Ney Meen', price: 520, trend: 'down', trendPercentage: 3.1, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 92 },
  ],
  'Vizag Fishing Harbour': [
    { id: 'v1', name: 'Seer Fish', scientificName: 'Neymeen / Surmai', price: 658, trend: 'up', trendPercentage: 8.4, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 93 },
    { id: 'v2', name: 'Pomfret (Black)', scientificName: 'Avoli / Halwa', price: 667, trend: 'up', trendPercentage: 10.8, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 94 },
    { id: 'v3', name: 'Crab', scientificName: 'Njandu / Kekda', price: 398, trend: 'down', trendPercentage: 12.5, imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200', trustScore: 90 },
    { id: 'v4', name: 'Prawns (Medium)', scientificName: 'Chemmeen', price: 421, trend: 'up', trendPercentage: 9.1, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200', trustScore: 92 },
    { id: 'v5', name: 'Red Snapper', scientificName: 'Chempalli', price: 342, trend: 'down', trendPercentage: 8.3, imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200', trustScore: 87 },
    { id: 'v6', name: 'Tuna', scientificName: 'Choora', price: 262, trend: 'down', trendPercentage: 6.4, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 89 },
    { id: 'v7', name: 'Mackerel', scientificName: 'Ayala', price: 188, trend: 'down', trendPercentage: 18.3, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 91 },
    { id: 'v8', name: 'Sardine', scientificName: 'Mathi / Chaala', price: 118, trend: 'down', trendPercentage: 16.3, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200', trustScore: 92 },
    { id: 'v9', name: 'Anchovies', scientificName: 'Netholi / Kozhuva', price: 95, trend: 'down', trendPercentage: 20.8, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 88 },
    { id: 'v10', name: 'King Fish', scientificName: 'Ney Meen', price: 485, trend: 'down', trendPercentage: 6.7, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 91 },
  ],
  'Mangalore Old Port': [
    { id: 'm1', name: 'Seer Fish', scientificName: 'Neymeen / Surmai', price: 580, trend: 'down', trendPercentage: 4.4, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 94 },
    { id: 'm2', name: 'Pomfret (Black)', scientificName: 'Avoli / Halwa', price: 590, trend: 'down', trendPercentage: 2.0, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 93 },
    { id: 'm3', name: 'Crab', scientificName: 'Njandu / Kekda', price: 478, trend: 'up', trendPercentage: 5.1, imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200', trustScore: 91 },
    { id: 'm4', name: 'Prawns (Medium)', scientificName: 'Chemmeen', price: 365, trend: 'down', trendPercentage: 5.4, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200', trustScore: 89 },
    { id: 'm5', name: 'Red Snapper', scientificName: 'Chempalli', price: 398, trend: 'up', trendPercentage: 6.7, imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200', trustScore: 90 },
    { id: 'm6', name: 'Tuna', scientificName: 'Choora', price: 295, trend: 'up', trendPercentage: 5.4, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 92 },
    { id: 'm7', name: 'Mackerel', scientificName: 'Ayala', price: 245, trend: 'up', trendPercentage: 6.5, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 94 },
    { id: 'm8', name: 'Sardine', scientificName: 'Mathi / Chaala', price: 155, trend: 'up', trendPercentage: 9.9, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200', trustScore: 93 },
    { id: 'm9', name: 'Anchovies', scientificName: 'Netholi / Kozhuva', price: 132, trend: 'up', trendPercentage: 10.0, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 90 },
    { id: 'm10', name: 'King Fish', scientificName: 'Ney Meen', price: 548, trend: 'up', trendPercentage: 5.4, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 93 },
  ],
  'Sassoon Dock': [
    { id: 's1', name: 'Seer Fish', scientificName: 'Neymeen / Surmai', price: 695, trend: 'up', trendPercentage: 14.5, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 96 },
    { id: 's2', name: 'Pomfret (Black)', scientificName: 'Avoli / Halwa', price: 720, trend: 'up', trendPercentage: 19.6, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 97 },
    { id: 's3', name: 'Crab', scientificName: 'Njandu / Kekda', price: 512, trend: 'up', trendPercentage: 12.5, imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200', trustScore: 94 },
    { id: 's4', name: 'Prawns (Medium)', scientificName: 'Chemmeen', price: 425, trend: 'up', trendPercentage: 10.1, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200', trustScore: 93 },
    { id: 's5', name: 'Red Snapper', scientificName: 'Chempalli', price: 428, trend: 'up', trendPercentage: 14.7, imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200', trustScore: 91 },
    { id: 's6', name: 'Tuna', scientificName: 'Choora', price: 315, trend: 'up', trendPercentage: 12.5, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 93 },
    { id: 's7', name: 'Mackerel', scientificName: 'Ayala', price: 268, trend: 'up', trendPercentage: 16.5, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 95 },
    { id: 's8', name: 'Sardine', scientificName: 'Mathi / Chaala', price: 168, trend: 'up', trendPercentage: 19.1, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200', trustScore: 94 },
    { id: 's9', name: 'Anchovies', scientificName: 'Netholi / Kozhuva', price: 145, trend: 'up', trendPercentage: 20.8, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 91 },
    { id: 's10', name: 'King Fish', scientificName: 'Ney Meen', price: 595, trend: 'up', trendPercentage: 14.4, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 94 },
  ],
  'Chennai Kasimedu': [
    { id: 'c1', name: 'Seer Fish', scientificName: 'Neymeen / Surmai', price: 625, trend: 'up', trendPercentage: 3.0, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 93 },
    { id: 'c2', name: 'Pomfret (Black)', scientificName: 'Avoli / Halwa', price: 612, trend: 'up', trendPercentage: 1.7, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 92 },
    { id: 'c3', name: 'Crab', scientificName: 'Njandu / Kekda', price: 435, trend: 'down', trendPercentage: 4.4, imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200', trustScore: 90 },
    { id: 'c4', name: 'Prawns (Medium)', scientificName: 'Chemmeen', price: 378, trend: 'down', trendPercentage: 2.1, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200', trustScore: 91 },
    { id: 'c5', name: 'Red Snapper', scientificName: 'Chempalli', price: 352, trend: 'down', trendPercentage: 5.6, imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200', trustScore: 88 },
    { id: 'c6', name: 'Tuna', scientificName: 'Choora', price: 248, trend: 'down', trendPercentage: 11.4, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 89 },
    { id: 'c7', name: 'Mackerel', scientificName: 'Ayala', price: 198, trend: 'down', trendPercentage: 13.9, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200', trustScore: 91 },
    { id: 'c8', name: 'Sardine', scientificName: 'Mathi / Chaala', price: 125, trend: 'down', trendPercentage: 11.3, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200', trustScore: 92 },
    { id: 'c9', name: 'Anchovies', scientificName: 'Netholi / Kozhuva', price: 108, trend: 'down', trendPercentage: 10.0, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', trustScore: 88 },
    { id: 'c10', name: 'King Fish', scientificName: 'Ney Meen', price: 498, trend: 'down', trendPercentage: 4.2, imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200', trustScore: 91 },
  ],
};

// Cross-harbour prices for search
const CROSS_HARBOUR_PRICES: Record<string, Record<string, { price: number; trend: 'up' | 'down'; trendPercentage: number }>> = {
  'Seer Fish': {
    'Kochi Harbour': { price: 607, trend: 'down', trendPercentage: 13 },
    'Vizag Fishing Harbour': { price: 658, trend: 'down', trendPercentage: 4 },
    'Mangalore Old Port': { price: 580, trend: 'up', trendPercentage: 6 },
    'Sassoon Dock': { price: 695, trend: 'down', trendPercentage: 22 },
    'Chennai Kasimedu': { price: 625, trend: 'down', trendPercentage: 10 },
  },
  'Pomfret (Black)': {
    'Kochi Harbour': { price: 602, trend: 'down', trendPercentage: 11 },
    'Vizag Fishing Harbour': { price: 667, trend: 'up', trendPercentage: 11 },
    'Mangalore Old Port': { price: 590, trend: 'down', trendPercentage: 2 },
    'Sassoon Dock': { price: 720, trend: 'up', trendPercentage: 20 },
    'Chennai Kasimedu': { price: 612, trend: 'up', trendPercentage: 2 },
  },
  // Add more fish here as needed
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHarbour, setSelectedHarbour] = useState('Kochi Harbour');
  const [selectedFish, setSelectedFish] = useState<SpeciesData | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [dataKey, setDataKey] = useState(0);

  const cart = useCart();

  // Ticker animation
  const tickerAnim = useRef(new Animated.Value(0)).current;
  const currentSpecies = HARBOUR_SPECIES[selectedHarbour] || [];
  const TICKER_WIDTH = currentSpecies.length * 170;

  useEffect(() => {
    tickerAnim.setValue(0);
    Animated.loop(
      Animated.timing(tickerAnim, {
        toValue: -TICKER_WIDTH,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, [selectedHarbour]);

  const weather = WEATHER_DATA[selectedHarbour] || WEATHER_DATA['Kochi Harbour'];

  const handleHarbourChange = (harbour: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedHarbour(harbour);
    setDataKey(prev => prev + 1);
  };

  const handleFishPress = (fish: SpeciesData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFish(fish);
    setShowDetail(true);
  };

  const handleAddToCart = (fish: SpeciesData) => {
    cart.addItem({
      id: fish.id,
      name: fish.name,
      scientificName: fish.scientificName,
      price: fish.price,
      trend: fish.trend,
      trendPercentage: fish.trendPercentage,
      imageUrl: fish.imageUrl,
      harbour: selectedHarbour,
    });
  };

  const filteredData = currentSpecies.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if search matches a fish for cross-harbour view
  const searchedFish = searchQuery.length > 2
    ? Object.keys(CROSS_HARBOUR_PRICES).find(f =>
      f.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : null;

  const crossHarbourData = searchedFish ? CROSS_HARBOUR_PRICES[searchedFish] : null;

  const renderTickerItem = (item: SpeciesData, index: number) => (
    <View key={index} style={styles.tickerItem}>
      <Text style={styles.tickerName}>{item.name}</Text>
      <Text style={styles.tickerPrice}>₹{item.price}</Text>
      <View style={[
        styles.tickerBadge,
        { backgroundColor: item.trend === 'down' ? '#450a0a' : '#052e16' }
      ]}>
        <Ionicons
          name={item.trend === 'down' ? "caret-down" : "caret-up"}
          size={10}
          color={item.trend === 'down' ? '#ef4444' : '#22c55e'}
        />
        <Text style={[
          styles.tickerPercent,
          { color: item.trend === 'down' ? '#ef4444' : '#22c55e' }
        ]}>
          {item.trendPercentage.toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* App Header */}
      <AppHeader />

      {/* Animated Price Ticker */}
      <View style={styles.tickerContainer}>
        <Animated.View
          style={[
            styles.tickerScroll,
            { transform: [{ translateX: tickerAnim }] }
          ]}
        >
          {currentSpecies.map((item, i) => renderTickerItem(item, i))}
          {currentSpecies.map((item, i) => renderTickerItem(item, i + currentSpecies.length))}
        </Animated.View>
      </View>

      {/* Harbour Selector */}
      <HarbourSelector
        selectedHarbour={selectedHarbour}
        onSelect={handleHarbourChange}
      />

      {/* Weather Card - Animated on harbour change */}
      <MotiView
        key={`weather-${dataKey}`}
        from={{ opacity: 0.6, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <LinearGradient
          colors={['#3b82f6', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weatherCard}
        >
          <View style={styles.weatherMain}>
            <View style={styles.weatherLeft}>
              <View style={styles.weatherLocRow}>
                <Ionicons name="navigate" size={10} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherLoc} numberOfLines={1}>
                  {selectedHarbour.replace(' Harbour', '').replace(' Fishing', '').toUpperCase()}
                </Text>
              </View>
              <View style={styles.tempRow}>
                <Text style={styles.temp}>{weather.temp}°</Text>
                <View style={styles.weatherDetails}>
                  <Text style={styles.weatherCondition}>{weather.condition}</Text>
                  <View style={styles.windPill}>
                    <FontAwesome5 name="wind" size={8} color="white" />
                    <Text style={styles.windText}>{weather.wind} km/h</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.weatherIconCol}>
              <Ionicons
                name={weather.condition === 'Sunny' ? 'sunny' :
                  weather.condition === 'Cloudy' ? 'cloudy' :
                    'partly-sunny'}
                size={40}
                color="white"
              />
              <Text style={styles.humidityText}>{weather.humidity}% Humidity</Text>
            </View>
          </View>
        </LinearGradient>
      </MotiView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search species..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#64748b" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Cross-Harbour Price Card (appears on search) */}
      {crossHarbourData && (
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.crossHarbourCard}
        >
          <View style={styles.crossHarbourHeader}>
            <Ionicons name="location" size={16} color="#a78bfa" />
            <Text style={styles.crossHarbourTitle}>PRICES ACROSS ALL HARBOURS</Text>
          </View>
          <View style={styles.crossHarbourFishRow}>
            <FontAwesome5 name="fish" size={14} color="#3b82f6" />
            <Text style={styles.crossHarbourFishName}>{searchedFish}</Text>
          </View>
          <View style={styles.crossHarbourGrid}>
            {Object.entries(crossHarbourData).map(([harbour, data]) => (
              <TouchableOpacity
                key={harbour}
                style={styles.harbourPriceCard}
                onPress={() => handleHarbourChange(harbour)}
                activeOpacity={0.8}
              >
                <Text style={styles.harbourPriceName} numberOfLines={1}>
                  {harbour.split(' ')[0].toUpperCase()}
                </Text>
                <Text style={styles.harbourPriceValue}>₹{data.price}</Text>
                <Text style={[
                  styles.harbourPriceTrend,
                  { color: data.trend === 'down' ? '#ef4444' : '#22c55e' }
                ]}>
                  {data.trend === 'down' ? '↓' : '↑'} {data.trendPercentage}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>
      )}

      {/* List Title */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>TODAY'S RATES</Text>
        <Text style={styles.itemCount}>{filteredData.length} species</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <FlatList
          key={dataKey}
          data={filteredData}
          keyExtractor={(item) => item.id}
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
                />
              </TouchableOpacity>
            </MotiView>
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContent: {
    marginBottom: 12,
  },
  tickerContainer: {
    height: 30,
    marginHorizontal: -16,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  tickerScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 5,
  },
  tickerName: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'Outfit_500Medium',
  },
  tickerPrice: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
  },
  tickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  tickerPercent: {
    fontSize: 9,
    fontFamily: 'Outfit_700Bold',
  },
  weatherCard: {
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flex: 1,
  },
  weatherLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  weatherLoc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: 'Outfit_500Medium',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  temp: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
  },
  weatherDetails: {
    gap: 3,
  },
  weatherCondition: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
  },
  windPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
    gap: 3,
  },
  windText: {
    color: 'white',
    fontSize: 9,
    fontFamily: 'Outfit_500Medium',
  },
  weatherIconCol: {
    alignItems: 'center',
    gap: 4,
  },
  humidityText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontFamily: 'Outfit_500Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: 'white',
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
  },
  crossHarbourCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  crossHarbourHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  crossHarbourTitle: {
    color: '#94a3b8',
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
    color: 'white',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  crossHarbourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  harbourPriceCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  harbourPriceName: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 4,
  },
  harbourPriceValue: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
  },
  harbourPriceTrend: {
    fontSize: 11,
    fontFamily: 'Outfit_600SemiBold',
    marginTop: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'Outfit_700Bold',
  },
  itemCount: {
    color: '#64748b',
    fontSize: 11,
    fontFamily: 'Outfit_400Regular',
  },
});

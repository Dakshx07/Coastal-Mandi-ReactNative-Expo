import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import SpeciesCard from '@/components/SpeciesCard';
import FloatingActions from '@/components/FloatingActions';
import HarbourSelector from '@/components/HarbourSelector';
import FishDetailModal from '@/components/FishDetailModal';

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

const MOCK_DATA: SpeciesData[] = [
  {
    id: '1',
    name: 'Seer Fish',
    scientificName: 'Neymeen / Surmai',
    price: 607,
    trend: 'down',
    trendPercentage: 12.79,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200',
    trustScore: 95,
  },
  {
    id: '2',
    name: 'Pomfret (Black)',
    scientificName: 'Avoli / Halwa',
    price: 602,
    trend: 'down',
    trendPercentage: 10.81,
    imageUrl: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200',
    trustScore: 95,
  },
  {
    id: '3',
    name: 'Crab',
    scientificName: 'Njandu / Kekda',
    price: 455,
    trend: 'up',
    trendPercentage: 3.2,
    imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200',
  },
  {
    id: '4',
    name: 'Sardine',
    scientificName: 'Mathi / Chaala',
    price: 141,
    trend: 'up',
    trendPercentage: 5.2,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200',
  },
  {
    id: '5',
    name: 'Mackerel',
    scientificName: 'Ayala',
    price: 230,
    trend: 'up',
    trendPercentage: 8.4,
    imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200',
  },
  {
    id: '6',
    name: 'Prawns (Medium)',
    scientificName: 'Chemmeen',
    price: 386,
    trend: 'down',
    trendPercentage: 0.52,
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200',
  },
  {
    id: '7',
    name: 'Red Snapper',
    scientificName: 'Chempalli',
    price: 373,
    trend: 'up',
    trendPercentage: 1.08,
    imageUrl: 'https://images.unsplash.com/photo-1535140875734-c8e082f5b51d?w=200',
  },
];

// Price ticker data
const TICKER_DATA = MOCK_DATA.slice(0, 4).map(d => ({
  name: d.name,
  price: d.price,
  trend: d.trend,
  percentage: d.trendPercentage,
}));

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHarbour, setSelectedHarbour] = useState('Kochi Harbour');
  const [selectedFish, setSelectedFish] = useState<SpeciesData | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleFishPress = (fish: SpeciesData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFish(fish);
    setShowDetail(true);
  };

  const handleAddToCart = (fish: SpeciesData) => {
    // TODO: Add to cart context/state
    console.log('Added to cart:', fish.name);
  };

  const filteredData = MOCK_DATA.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Price Ticker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tickerContainer}
        contentContainerStyle={styles.tickerContent}
      >
        {TICKER_DATA.map((item, index) => (
          <View key={index} style={styles.tickerItem}>
            <Text style={styles.tickerName}>{item.name}:</Text>
            <Text style={styles.tickerPrice}>₹{item.price}</Text>
            <View style={[
              styles.tickerBadge,
              { backgroundColor: item.trend === 'down' ? '#450a0a' : '#052e16' }
            ]}>
              <Ionicons
                name={item.trend === 'down' ? "trending-down" : "trending-up"}
                size={12}
                color={item.trend === 'down' ? '#ef4444' : '#22c55e'}
              />
              <Text style={[
                styles.tickerPercent,
                { color: item.trend === 'down' ? '#ef4444' : '#22c55e' }
              ]}>
                {item.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Harbour Selector */}
      <HarbourSelector
        selectedHarbour={selectedHarbour}
        onSelect={setSelectedHarbour}
      />

      {/* Weather Card */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100 }}
      >
        <LinearGradient
          colors={['#3b82f6', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weatherCard}
        >
          <View style={styles.weatherMain}>
            <View>
              <View style={styles.weatherLocRow}>
                <Ionicons name="navigate" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.weatherLoc}>{selectedHarbour.toUpperCase()}</Text>
              </View>
              <View style={styles.tempRow}>
                <Text style={styles.temp}>29°C</Text>
                <Text style={styles.weatherCondition}>Humid</Text>
              </View>
            </View>
            <View style={styles.weatherIconCol}>
              <Ionicons name="partly-sunny" size={48} color="white" />
              <View style={styles.windPill}>
                <FontAwesome5 name="wind" size={10} color="white" />
                <Text style={styles.windText}>14 km/h</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </MotiView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          placeholder="Search species (e.g. Sardine, Mathi)..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List Title */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>TODAY'S RATES</Text>
        <Text style={styles.itemCount}>{filteredData.length} Species Listed</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
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
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      <FloatingActions />

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
    padding: 20,
    paddingBottom: 100,
  },
  headerContent: {
    marginBottom: 20,
  },
  tickerContainer: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  tickerContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tickerName: {
    color: '#94a3b8',
    fontSize: 13,
    fontFamily: 'Outfit_500Medium',
  },
  tickerPrice: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  tickerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  tickerPercent: {
    fontSize: 11,
    fontFamily: 'Outfit_700Bold',
  },
  weatherCard: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  weatherLoc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'Outfit_500Medium',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  temp: {
    color: 'white',
    fontSize: 42,
    fontFamily: 'Outfit_700Bold',
  },
  weatherCondition: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Outfit_500Medium',
  },
  weatherIconCol: {
    alignItems: 'center',
    gap: 8,
  },
  windPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  windText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Outfit_500Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: 'white',
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: 'Outfit_700Bold',
  },
  itemCount: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
  },
});

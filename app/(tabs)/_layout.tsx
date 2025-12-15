import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '@/contexts/CartContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70 + insets.bottom / 2,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0f172a',
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 8,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} tint="dark" style={{ flex: 1 }} />
          ) : null,
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: {
          fontFamily: 'Outfit_500Medium',
          fontSize: 10,
          marginTop: 4,
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rates',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Compare',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="exchange-alt" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calc',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name="calculator" size={18} color={focused ? '#22c55e' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={22}
                color={focused ? '#ef4444' : color}
              />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'AI',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={focused ? '#eab308' : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontFamily: 'Outfit_700Bold',
  },
});

import React from 'react';
import { Tabs, router } from 'expo-router';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { useCart } from '@/contexts/CartContext';

// Consistent premium color palette
const TAB_COLORS = {
  home: '#3b82f6',      // Blue
  compare: '#8b5cf6',   // Purple
  voice: '#f59e0b',     // Yellow/Amber for Assistant
  premium: '#f59e0b',   // Gold/Amber for Premium
  saved: '#ef4444',     // Red
  insights: '#10b981',  // Emerald for AI/Insights
  calculator: '#22c55e', // Green
  inactive: '#64748b',   // Gray
};

interface TabIconProps {
  name: string;
  color: string;
  focused: boolean;
  size?: number;
}

function TabIconWithAnimation({ name, color, focused, size = 22 }: TabIconProps) {
  return (
    <MotiView
      animate={{
        scale: focused ? [1, 1.2, 1] : 1,
        rotateZ: focused ? '0deg' : '0deg',
      }}
      transition={{
        type: 'spring',
        damping: 10,
        stiffness: 100,
      }}
    >
      <Ionicons name={name as any} size={size} color={color} />
    </MotiView>
  );
}

function FontAwesomeIconWithAnimation({ name, color, focused, size = 18 }: any) {
  return (
    <MotiView
      animate={{
        scale: focused ? [1, 1.2, 1] : 1,
      }}
      transition={{
        type: 'spring',
        damping: 10,
        stiffness: 100,
      }}
    >
      <FontAwesome5 name={name} size={size} color={color} />
    </MotiView>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <>
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
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: TAB_COLORS.inactive,
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
            tabBarIcon: ({ focused }) => (
              <TabIconWithAnimation
                name={focused ? 'home' : 'home-outline'}
                color={focused ? TAB_COLORS.home : TAB_COLORS.inactive}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="compare"
          options={{
            title: 'Compare',
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIconWithAnimation
                name="exchange-alt"
                color={focused ? TAB_COLORS.compare : TAB_COLORS.inactive}
                focused={focused}
              />
            ),
          }}
        />



        <Tabs.Screen
          name="cart"
          options={{
            title: 'Saved',
            tabBarIcon: ({ focused }) => (
              <View>
                <TabIconWithAnimation
                  name={focused ? 'heart' : 'heart-outline'}
                  color={focused ? TAB_COLORS.saved : TAB_COLORS.inactive}
                  focused={focused}
                />
                {cartCount > 0 && (
                  <MotiView
                    style={styles.badge}
                    from={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                  </MotiView>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: 'Upgrade',
            tabBarIcon: ({ focused }) => (
              <TabIconWithAnimation
                name={focused ? 'diamond' : 'diamond-outline'}
                color={focused ? TAB_COLORS.premium : TAB_COLORS.inactive}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="insights"
          options={{
            title: 'AI',
            tabBarIcon: ({ focused }) => (
              <TabIconWithAnimation
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                color={focused ? TAB_COLORS.insights : TAB_COLORS.inactive}
                focused={focused}
              />
            ),
          }}
        />

        {/* Hidden Tabs (Calculator moved to FAB, Settings unused in bar) */}
        <Tabs.Screen
          name="calculator"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
      </Tabs>

      {/* Floating Calculator Button */}
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        style={[styles.fabContainer, { bottom: 90 + insets.bottom }]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/(tabs)/calculator')}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="calculator" size={20} color="white" />
        </TouchableOpacity>
      </MotiView>
    </>
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
  voiceTabContainer: {
    marginBottom: 20, // Push up slightly 
    marginTop: -10,
  },
  voiceTabCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 0,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

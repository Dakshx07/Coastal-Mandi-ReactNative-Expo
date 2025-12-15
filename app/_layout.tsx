import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold
} from '@expo-google-fonts/outfit';

import { CartProvider } from '@/contexts/CartContext';

// Suppress warnings from dependencies
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'Non-serializable values were found in the navigation state',
]);

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const CoastalTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0b0f19',
    card: '#1e293b',
    text: '#f8fafc',
    border: '#334155',
    primary: '#3b82f6',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CartProvider>
      <ThemeProvider value={CoastalTheme}>
        <StatusBar style="light" />
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: '#0b0f19',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Outfit_700Bold',
          },
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="signup" options={{ headerShown: false, animation: 'slide_from_right' }} />
        </Stack>
      </ThemeProvider>
    </CartProvider>
  );
}

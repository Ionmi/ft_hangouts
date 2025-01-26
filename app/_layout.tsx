import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LanguageProvider } from '@/contexts/LanguageContext';
import TooltipAlert from '../components/TooltipAlert';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { HeaderStyleProvider } from '../contexts/HeaderStyleContext';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from '../db/init';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="contacts.db" onInit={migrateDbIfNeeded}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <HeaderStyleProvider>
          <LanguageProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <TooltipAlert />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </LanguageProvider>
        </HeaderStyleProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}

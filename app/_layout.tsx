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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HeaderStyleProvider } from '../contexts/HeaderStyleContext';
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from '../db/init';
import { SmsProvider } from '../contexts/SmsContext';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

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

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          ];
          const grantedPermissions = await PermissionsAndroid.requestMultiple(permissions);
          const allGranted = permissions.every(
            permission => grantedPermissions[permission] === PermissionsAndroid.RESULTS.GRANTED
          );
          if (!allGranted) {
            Alert.alert(t("permissionDeniedTitle"), t("permissionDeniedMessage"));
          }
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestPermissions();
  }, [t]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="contacts.db" onInit={migrateDbIfNeeded}>
      <SafeAreaProvider>
        <HeaderStyleProvider>
          <LanguageProvider>
            <SmsProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <TooltipAlert />
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="contact" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </SmsProvider>
          </LanguageProvider>
        </HeaderStyleProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
function t(arg0: string): string {
  throw new Error('Function not implemented.');
}


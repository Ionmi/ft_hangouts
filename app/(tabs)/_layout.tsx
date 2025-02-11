import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAccentStyle } from '@/contexts/HeaderStyleContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TabLayout() {
  const { color: accentColor } = useAccentStyle();
  const { t } = useLanguage();

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

  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accentColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('messages'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
    </Tabs>

  );
}

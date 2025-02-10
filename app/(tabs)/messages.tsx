import React, { useEffect, useState } from 'react';
import { StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '../../contexts/LanguageContext';
import SmsModule from '../../modules/sms';
import ParallaxScrollView from '../../components/ParallaxScrollView';

export default function MessagesScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const requestSmsPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
              title: t("smsPermissionTitle"),
              message: t("smsPermissionMessage"),
              buttonNeutral: t("smsPermissionAskMeLater"),
              buttonNegative: t("smsPermissionCancel"),
              buttonPositive: t("smsPermissionOk"),
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchMessages();
          } else {
            Alert.alert(t("permissionDeniedTitle"), t("permissionDeniedMessage"));
          }
        } else {
          fetchMessages();
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const fetchMessages = async () => {
      try {
        const smsMessages = await SmsModule.readSMS();
        setMessages(smsMessages);
      } catch (error) {
        console.error("Failed to read SMS messages:", error);
      }
    };

    requestSmsPermission();
  }, [t]);

  return (
    <ParallaxScrollView
      header={
        <IconSymbol
          size={240}
          color="#000"
          name="message"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("messages")}</ThemedText>
      </ThemedView>

      <ThemedText type="title">{SmsModule.PI}</ThemedText>

      {messages.map((message, index) => {
        return (
          <ThemedView key={index} style={styles.messageContainer}>
            <ThemedText>{message}</ThemedText>
          </ThemedView>
        )
      })}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#000',
    bottom: -50,
    left: 20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

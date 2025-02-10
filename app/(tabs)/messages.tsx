import React, { useEffect, useState } from 'react';
import { StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '../../contexts/LanguageContext';
import SmsModule from '../../modules/sms';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { DeviceEventEmitter } from 'react-native';

export default function MessagesScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const requestSmsPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
          ];

          const grantedPermissions = await PermissionsAndroid.requestMultiple(permissions);

          const allGranted = permissions.every(permission =>
            grantedPermissions[permission] === PermissionsAndroid.RESULTS.GRANTED
          );

          if (allGranted) {
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

    const handleSmsReceived = (event: any) => {
      console.log('Received SMS event:', event);
      setMessages((prevMessages) => [
        ...prevMessages,
        `From: ${event.sender}, Message: ${event.message}`,
      ]);
    };

    const subscription = DeviceEventEmitter.addListener('onSmsReceived', handleSmsReceived);

    requestSmsPermissions();

    return () => {
      subscription.remove();
    };
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

      {messages.map((message, index) => (
        <ThemedView key={index} style={styles.messageContainer}>
          <ThemedText>{message}</ThemedText>
        </ThemedView>
      ))}
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

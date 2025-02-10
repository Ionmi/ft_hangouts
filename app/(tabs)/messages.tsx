import React, { useEffect, useState } from 'react';
import { StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '../../contexts/LanguageContext';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { useEventListener } from 'expo';
import * as Sms from '../../modules/sms';

export default function MessagesScreen() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleSmsReceived = (event: { sender: string; message: string }) => {
      console.log('Received SMS event:', event);
      setMessages(prev => [
        `From: ${event.sender}, Message: ${event.message}`,
        ...prev,
      ]);
    };

    // Directly use SmsModule.addListener as it is already an EventEmitter.
    const subscription = Sms.addSmsListener('onSmsReceived', handleSmsReceived);
    console.log('SMS listener added');

    // Request permissions and fetch SMS messages
    const requestSmsPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          ];
          const grantedPermissions = await PermissionsAndroid.requestMultiple(permissions);
          const allGranted = permissions.every(
            permission => grantedPermissions[permission] === PermissionsAndroid.RESULTS.GRANTED
          );
          if (allGranted) {
            const smsMessages = await Sms.readSMS();
            setMessages(smsMessages);
          } else {
            Alert.alert(t("permissionDeniedTitle"), t("permissionDeniedMessage"));
          }
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestSmsPermissions();

    return () => {
      console.log('Cleaning up SMS listener');
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
    position: 'absolute',
    left: 20,
    bottom: -50,
    color: '#000',
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
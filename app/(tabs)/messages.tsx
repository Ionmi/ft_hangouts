import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '../../contexts/LanguageContext';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { useSms } from '../../contexts/SmsContext';
import { Sms } from '../../modules/sms';

const row = (message: Sms) => {
  return (
    <ThemedView style={styles.messageContainer}>
      <ThemedText>{message.body}</ThemedText>
    </ThemedView>
  );
}

export default function MessagesScreen() {
  const { t } = useLanguage();

  const { messages } = useSms();

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
          <ThemedText>{message.body}</ThemedText>
          {/* {row(message)} */}
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
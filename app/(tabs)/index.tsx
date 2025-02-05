import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Modal } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccentStyle } from '../../contexts/HeaderStyleContext';
import Button from '../../components/ui/Button';
import { IconSymbol } from '../../components/ui/IconSymbol';
import ContactForm from '../../components/ContactForm';
import { Contact } from '../../types/Contact';
import { getContacts, saveContact } from '../../db/sqliteService';
import { useSQLiteContext } from 'expo-sqlite';
import ContactCardList from '../../components/ContactCardList';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { t } = useLanguage();
  const { color } = useAccentStyle();
  const [modalVisible, setModalVisible] = useState(false);
  const db = useSQLiteContext();

  const fetchContacts = async () => {
    const result = await getContacts(db);
    setContacts(result);
  };
  useEffect(() => {
    // Fetch contacts on component mount
    fetchContacts();
  }, []);  // Empty dependency ensures this only runs once

  const handleFormSubmit = async (contact: Contact) => {
    try {
      // Save the new contact and refresh the list
      await saveContact(db, contact);
      setModalVisible(false);
      const updatedContacts = await getContacts(db);
      setContacts(updatedContacts);
    } catch (error) {
      console.error("Error saving contact: ", error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
    }, [])
  );


  return (
    <ParallaxScrollView
      header={<Image source={require('@/assets/images/42.png')} style={styles.ftLogo} />}
      nestedScrollEnabled={true}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("contacts")}</ThemedText>
        {/* <HelloWave /> */}
        <ThemedView style={{ flex: 1 }} />
        <Button onPress={() => setModalVisible(true)}>
          <IconSymbol name="plus" size={24} color={color} />
        </Button>
      </ThemedView>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
      >
        <ContactForm onSubmit={handleFormSubmit} onCancel={() => setModalVisible(false)} />
      </Modal>

      <ContactCardList contacts={contacts} />

    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  contactItem: {
    marginBottom: 12,
  },
  ftLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  contactsListContainer: {
    flex: 1,
    padding: 10,
  },
});
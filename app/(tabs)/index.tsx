import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Modal } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAccentStyle } from '../../contexts/HeaderStyleContext';
import Button from '../../components/ui/Button';
import { IconSymbol } from '../../components/ui/IconSymbol';
import ContactForm from '../../components/ContactForm';
import { Contact } from '../../types/Contact';
import { deleteContact, getContacts, saveContact, updateContact } from '../../db/sqliteService';
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

  const handleUpdate = async (id: number) => {
    const updatedContact: Partial<Contact> = {
      name: 'Updated Name',
      phone: '987654321',
    };
    await updateContact(id, updatedContact);
    const updatedContacts = await getContacts(db);  // Refresh the list
    setContacts(updatedContacts);
  };

  const handleDelete = async (id: number) => {
    await deleteContact(db, id);
    const updatedContacts = await getContacts(db);  // Refresh the list
    setContacts(updatedContacts);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
    }, [])
  );


  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/42.png')} style={styles.ftLogo} />}
      nestedScrollEnabled={true}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("contacts")}</ThemedText>
        <HelloWave />
        <ThemedView style={{ flex: 1 }} />
        <Button onPress={() => setModalVisible(true)}>
          <IconSymbol name="plus" size={24} color={color} />
        </Button>
      </ThemedView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ContactForm onSubmit={handleFormSubmit} onCancel={() => setModalVisible(false)} />
      </Modal>

      <ContactCardList contacts={contacts}/>

    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
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
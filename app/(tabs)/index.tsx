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

export default function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { t } = useLanguage();
  const { color } = useAccentStyle();
  const [modalVisible, setModalVisible] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    // Fetch contacts on component mount
    const fetchContacts = async () => {
      const result = await getContacts(db);
      setContacts(result);
    };
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
    await deleteContact(id);
    const updatedContacts = await getContacts(db);  // Refresh the list
    setContacts(updatedContacts);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <ThemedView style={styles.contactItem} key={item.id}>
      <ThemedText>{item.name}</ThemedText>
      <ThemedText>{item.phone}</ThemedText>
      <ThemedText>{item.email}</ThemedText>
      <ThemedText>{item.birthdate}</ThemedText>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerImage={<Image source={require('@/assets/images/42.png')} style={styles.ftLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("contacts")}</ThemedText>
        <HelloWave />
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


      <ThemedView style={styles.contactsListContainer}>
        {/* Removed ScrollView, using FlatList directly */}
        {contacts.map((contact) => renderContactItem({ item: contact }))}
      </ThemedView>
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
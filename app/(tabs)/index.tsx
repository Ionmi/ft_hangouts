import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Modal, View } from 'react-native';
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
import { createContactsTable, getContacts, saveContact } from '../../db/sqliteService';

export default function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { t } = useLanguage();
  const { color } = useAccentStyle();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);
  
  const loadContacts = async () => {
    await createContactsTable();
    const data = await getContacts();
    setContacts(data);
  };


  const handleFormSubmit = async (contact: Contact) => {
    try {
      // await saveContact(contact);
      setContacts([...contacts, contact]);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ParallaxScrollView
      headerImage={
        <Image
          source={require('@/assets/images/42.png')}
          style={styles.ftLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t("contacts")}</ThemedText>
        <HelloWave />
        <ThemedView style={{ flex: 1 }} />
        <Button onPress={() => setModalVisible(true)}>
          <IconSymbol name='plus' size={24} color={color} />
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  ftLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

});
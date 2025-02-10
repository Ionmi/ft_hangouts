import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ImageURISource } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '../../contexts/LanguageContext';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { useSms } from '../../contexts/SmsContext';
import { Sms } from '../../modules/sms';
import { Contact } from '../../types/Contact';
import { useContacts } from '../../contexts/ContactsContext';
import { Link } from 'expo-router';

const ContactCard = ({ messages, contact }: ContactWithMessages) => {
  return (
    <ThemedView>
      <Link href={{
        pathname: "/contact",
        params: {
          ...contact,
        }
      }}>
        <ThemedView style={styles.contactItem} key={contact.id}>
          <Image source={{ uri: contact.photo } as ImageURISource} style={styles.photo} />
          <View style={{ flex: 1 }}>
            <ThemedText type='defaultSemiBold' >{contact.name}</ThemedText>
            <ThemedText>{messages[messages.length - 1].body}</ThemedText>
          </View>
          <IconSymbol name="chevron.right" color="gray" size={16} />
        </ThemedView>
      </Link>
    </ThemedView>
  );
}

interface ContactWithMessages {
  contact: Contact;
  messages: Sms[];
}

export default function MessagesScreen() {
  const { t } = useLanguage();

  const { messages } = useSms();
  const { contacts } = useContacts();

  const [messagesWithContacts, setMessagesWithContacts] = React.useState<ContactWithMessages[]>([]);

  useEffect(() => {
    const tmp: ContactWithMessages[] = contacts.map((contact) => {
      const messagesForContact = messages.filter((message) => message.address === contact.phone);
      return {
        contact,
        messages: messagesForContact,
      };
    }).filter((mc) => mc.messages.length > 0);

    setMessagesWithContacts(tmp);
  }, [messages, contacts]);


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
      {messagesWithContacts.map((mc, index) => (
        <ThemedView key={index}>{ContactCard(mc)}</ThemedView>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contactItem: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
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
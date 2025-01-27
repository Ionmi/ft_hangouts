import { FlatList } from "react-native-gesture-handler";
import { Contact } from "../types/Contact";
import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface ContactCardListProps {
    contacts: Contact[];
    setContacts: (contacts: Contact[]) => void;
}

const ContactCard = ({ contact }: { contact: Contact }) => {
    return (
        <ThemedView style={styles.contactItem} key={contact.id}>
            <ThemedText>{contact.name}</ThemedText>
            <ThemedText>{contact.phone}</ThemedText>
            <ThemedText>{contact.email}</ThemedText>
            <ThemedText>{contact.birthdate}</ThemedText>
        </ThemedView>
    );
}

export default function ContactCardList({ contacts }: ContactCardListProps) {
    return (
        <View>
            {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    contactItem: {
        padding: 10,
        margin: 5,
    },
});
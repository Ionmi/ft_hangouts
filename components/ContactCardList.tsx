import { Contact } from "../types/Contact";
import { View, StyleSheet, Image, ImageURISource } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";
import { useThemeColor } from "../hooks/useThemeColor";
import { Pressable } from "react-native";
import { Href, Link, useRouter } from 'expo-router';
import { Stack } from 'expo-router';

interface ContactCardListProps {
    contacts: Contact[];
    setContacts: (contacts: Contact[]) => void;
}







const ContactCard = ({ contact }: { contact: Contact }) => {

    return (
        <ThemedView>
            <Link href={{
                pathname: "/contact",
                params: {
                    name: contact.name,
                    phone: contact.phone,
                    email: contact.email,
                    photo: contact.photo,
                    birthdate: contact.birthdate,
                }
            }}>
                <ThemedView style={styles.contactItem} key={contact.id}>
                    <Image source={{ uri: contact.photo } as ImageURISource} style={styles.photo} />
                    <View style={{ flex: 1 }}>
                        <ThemedText>{contact.name}</ThemedText>
                        <ThemedText>{contact.phone}</ThemedText>
                    </View>
                    <IconSymbol name="chevron.right" color="gray" size={16} />
                </ThemedView>
            </Link>
        </ThemedView>
    );
}



export default function ContactCardList({ contacts }: ContactCardListProps) {
    return (
        <View style={styles.contactList}>
            {contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    contactList: {
        flex: 1,
        gap: 20,
    },
    contactItem: {
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    photo: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
    },
});

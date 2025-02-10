import { Contact } from "../types/Contact";
import { View, StyleSheet, Image, ImageURISource } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";
import { Link } from 'expo-router';
import { useAccentStyle } from "../contexts/HeaderStyleContext";
interface ContactCardListProps {
    contacts: Contact[];
}



export default function ContactCardList({ contacts }: ContactCardListProps) {
    const { color } = useAccentStyle();
    const ContactCard = ({ contact }: { contact: Contact }) => {

        return (
            <ThemedView>
                <Link href={{
                    pathname: "/contact",
                    params: {
                        ...contact,
                    }
                }}>
                    <ThemedView style={styles.contactItem} key={contact.id}>

                        {contact.photo !== "" ?
                            <Image source={{ uri: contact.photo } as ImageURISource} style={styles.photo} /> :
                            <IconSymbol name="person" size={60} color="black"
                                style={[styles.photo, { backgroundColor: color }]}
                            />
                        }
                        <View style={{ flex: 1 }}>
                            <ThemedText type="defaultSemiBold">{contact.name}</ThemedText>
                            <ThemedText>+{contact.phone}</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" color="gray" size={16} />
                    </ThemedView>
                </Link>
            </ThemedView>
        );
    }
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

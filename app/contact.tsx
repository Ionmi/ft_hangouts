import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {  StyleSheet, Image, ImageURISource, Modal } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { type Contact } from '../types/Contact';
import { useAccentStyle } from '../contexts/HeaderStyleContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { IconSymbol } from '../components/ui/IconSymbol';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteContact, updateContact } from '../db/sqliteService';
import { useSQLiteContext } from 'expo-sqlite';
import ContactForm from '../components/ContactForm';
import { useState } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';



export default function Contact() {
    const params = useLocalSearchParams();
    const { color } = useAccentStyle();
    const textColor = useThemeColor({}, 'text');
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const db = useSQLiteContext();
    const { t } = useLanguage();
    const [modalVisible, setModalVisible] = useState(false);
    const [contact, setContact] = useState<Contact>(params as unknown as Contact);
    const headerHeight = useHeaderHeight();

    const handleDelete = async () => {
        deleteContact(db, contact.id!);
        router.back();
    };

    const handleUpdate = async (updated: Contact) => {

        await updateContact(db, contact.id!, updated);
        setContact({
            id: contact.id,
            ...updated,
        });
        setModalVisible(false);
    };

    return (
        <ThemedView style={[{ paddingBottom: insets.bottom + 16, paddingTop: headerHeight + 16 }, styles.container]}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ContactForm onSubmit={handleUpdate}
                    contact={contact}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>

            <ThemedView style={styles.content}>
                <Stack.Screen
                    options={{
                        headerTransparent: true,
                        title: contact.name,
                        headerBackTitle: t('back'),
                        headerTintColor: textColor,
                        headerStyle: {
                            backgroundColor: color,
                        }
                    }}
                />

                <Image source={{ uri: contact.photo } as ImageURISource} style={styles.photo} />
                <ThemedText type="title" style={[styles.name, { color: textColor }]}>{contact.name}</ThemedText>
                <ThemedView style={styles.textContainer}>
                    <IconSymbol name="phone.fill" color={textColor} size={24} />
                    <ThemedText type='defaultSemiBold' style={[styles.phone, { color: textColor }]}>{contact.phone}</ThemedText>
                </ThemedView>

                <ThemedView style={styles.textContainer}>
                    <IconSymbol name="envelope.fill" color={textColor} size={24} />
                    <ThemedText type='defaultSemiBold' style={[styles.email, { color: textColor }]}>{contact.email}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.textContainer}>
                    <IconSymbol name="calendar" color={textColor} size={24} />
                    <ThemedText type='defaultSemiBold' style={[styles.birthdate, { color: textColor }]}>{contact.birthdate}</ThemedText>
                </ThemedView>

            </ThemedView>
            <ThemedView style={styles.buttonContainer}>
                <PrimaryButton onPress={() => { setModalVisible(true) }} text='Edit' icon='pencil' />
                <SecondaryButton onPress={handleDelete} text='Delete' icon='trash' />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 16,
        flex: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        gap: 4
    },
    buttonContainer: {
        gap: 8,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    photo: {
        height: 180,
        width: 180,
        borderRadius: 10,
        marginBottom: 16,
    },
    name: {
        marginBottom: 8,
    },
    phone: {
        fontSize: 18,
        marginBottom: 4,
    },
    email: {
        fontSize: 18,
        marginBottom: 4,
    },
    birthdate: {
        fontSize: 16,
    },
});

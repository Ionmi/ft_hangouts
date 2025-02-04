import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Image, ImageURISource, Modal, View, Alert } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { type Contact } from '../types/Contact';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { IconSymbol } from '../components/ui/IconSymbol';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteContact, updateContact } from '../db/sqliteService';
import { useSQLiteContext } from 'expo-sqlite';
import ContactForm from '../components/ContactForm';
import { useState } from 'react';
import Button from '../components/ui/Button';
import ParallaxScrollView from '../components/ParallaxScrollView';
import { useAccentStyle } from '../contexts/HeaderStyleContext';



export default function Contact() {
    const params = useLocalSearchParams();
    const textColor = useThemeColor({}, 'text');
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const db = useSQLiteContext();
    const { t } = useLanguage();
    const [modalVisible, setModalVisible] = useState(false);
    const [contact, setContact] = useState<Contact>(params as unknown as Contact);
    const { color } = useAccentStyle();

    const handleDelete = async () => {
        Alert.alert(
            t('confirmTitle'),
            t('confirmDeleteMessage'),
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async () => {
                        await deleteContact(db, contact.id!);
                        router.back();
                    },
                },
            ],
            { cancelable: true }
        );
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
        <ParallaxScrollView
            headerImage={
                <SafeAreaView style={[styles.header, { paddingTop: insets.top }]}>
                    <View style={[styles.headerContent,]}>
                        <Button onPress={() => router.back()} style={styles.backButton}>
                            <IconSymbol name="chevron.backward" color={textColor} size={24} />
                        </Button>
                        <Image source={{ uri: contact.photo } as ImageURISource} style={styles.photo} />
                    </View>
                </SafeAreaView>
            }
            style={[styles.content, { paddingBottom: insets.bottom + 16 }]}
        >

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

            <ThemedView style={styles.titleContent}>
                <ThemedText type="title" style={[styles.name, { color: textColor }]}>{contact.name}</ThemedText>

                <Button style={[styles.titleButtons, { backgroundColor: "red" }]} onPress={handleDelete}>
                    <IconSymbol name="trash" color={textColor} size={24} />
                </Button>
                <Button style={[styles.titleButtons, { backgroundColor: color }]} onPress={() => setModalVisible(true)}>
                    <IconSymbol name="pencil" color={textColor} size={24} />
                </Button>
            </ThemedView>
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
            <ThemedView style={styles.buttonContainer}>
                <PrimaryButton style={[styles.actionButton]} onPress={() => { }} text={t("message")} icon='message.fill' />
                <SecondaryButton style={[styles.actionButton]} onPress={() => { }} text={t("call")} icon='phone.fill' />
            </ThemedView>
        </ParallaxScrollView >
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    headerContent: {
        flexDirection: 'row',
        position: 'relative',
        width: '100%',
        height: '100%',
        paddingBottom: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: "50%",
        transform: [{ translateY: "-50%" }],
        padding: 8,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        padding: 32,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "flex-end",
        gap: 8,
    },
    actionButton: {
        flex: 1,
    },
    titleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    titleButtons: {
        borderRadius: 100,
        aspectRatio: 1,
        width: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    photo: {
        height: "100%",
        width: "auto",
        aspectRatio: 1,
        borderRadius: 10,
        marginBottom: 16,
    },
    name: {
        flex: 1,
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

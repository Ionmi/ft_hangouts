import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Image, Alert, ImageURISource, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from './ThemedText';
import { PrimaryButton } from './ui/PrimaryButton';
import { useThemeColor } from '../hooks/useThemeColor';
import { SecondaryButton } from './ui/SecondaryButton';
import { useAccentStyle } from '../contexts/HeaderStyleContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Contact } from '../types/Contact';
import { ThemedSafeArea } from './ThemedSafeArea';
import TextButton from './ui/TextButton';
import * as FileSystem from 'expo-file-system';
import { ThemedView } from './ThemedView';
import Button from './ui/Button';
import { IconSymbol } from './ui/IconSymbol';

interface ContactFormProps {
    onSubmit: (contact: Contact) => void;
    contact?: Contact | null;
    onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel, contact }) => {
    const color = useThemeColor({}, 'text');
    const [name, setName] = useState<string>(contact?.name || '');
    const [phone, setPhone] = useState<string>(contact?.phone || '');
    const [email, setEmail] = useState<string>(contact?.email || '');
    const [photo, setPhoto] = useState<string>(contact?.photo || '');
    const [birthdate, setBirthdate] = useState<Date | undefined>(contact?.birthdate ? new Date(contact.birthdate) : undefined);
    const { color: accent } = useAccentStyle();
    const { t } = useLanguage();
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            // Extract file name from the URI
            const fileName = imageUri.split('/').pop();
            // Define a new path in the document directory
            const documentDirectory = FileSystem.documentDirectory;
            if (!documentDirectory) {
                console.error('Document directory is null');
                return;
            }
            const newPath = documentDirectory + fileName;
            try {
                // Copy the image to the new path
                await FileSystem.copyAsync({
                    from: imageUri,
                    to: newPath,
                });
                // Set the persistent path
                setPhoto(newPath);
            } catch (error) {
                console.error('Error copying image: ', error);
                // Fallback to the original URI in case of an error
                setPhoto(imageUri);
            }
        }
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const handleSubmit = () => {
        if (!name || !phone || !email || !photo || !birthdate) {
            Alert.alert('Error', t('fillAllFields'));
            return;
        }

        if (!validatePhoneNumber(phone)) {
            Alert.alert('Error', t('invalidPhone'));
            return;
        }

        onSubmit({ name, phone, email, photo, birthdate: formatDate(birthdate) });
    };

    return (

        <ThemedSafeArea style={[styles.safeArea]}>

            <View style={styles.titleContainer}>
                <ThemedText type="title">
                    {contact ? t('editContact') : t('addContact')}
                </ThemedText>
                <TextButton title={t("cancel")} onPress={onCancel} color={accent} type="defaultSemiBold" />
            </View>


            <View style={styles.photoContainer}>
                {photo ? (
                    <View style={styles.photoWrapper}>
                        <Image source={{ uri: photo } as ImageURISource} style={styles.photo} />
                        <Button style={[styles.photoButton, { backgroundColor: accent }]} onPress={pickImage}>
                            <IconSymbol name="pencil" color={color} size={24} />
                        </Button>
                    </View>
                ) : (
                    <Button style={styles.selectPhotoButton} onPress={pickImage}>
                        <IconSymbol name="camera" size={24} color={color} />
                    </Button>
                )}
            </View>

            <ThemedText type="defaultSemiBold" style={[styles.label, { color }]}>Name</ThemedText>
            <TextInput
                style={[styles.input, { color }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={color}
            />

            <ThemedText type="defaultSemiBold" style={[styles.label, { color }]}>Phone</ThemedText>
            <TextInput
                style={[styles.input, { color }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor={color}
            />

            <ThemedText type="defaultSemiBold" style={[styles.label, { color }]}>Email</ThemedText>
            <TextInput
                style={[styles.input, { color }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter email"
                placeholderTextColor={color}
            />

            <ThemedView style={styles.birthdateContainer}>
                <ThemedText type="defaultSemiBold" style={[styles.label, { color }]}>Birthdate</ThemedText>

                {Platform.OS === 'android' &&
                    <TextButton
                        title={birthdate ? formatDate(birthdate) : "+"}
                        onPress={() => setShowDatePicker(true)}
                        color={accent}
                        type="defaultSemiBold"
                    />
                }
                {(Platform.OS === 'ios' || showDatePicker) && (
                    <DateTimePicker
                        accentColor={accent}
                        textColor={accent}
                        value={birthdate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setBirthdate(selectedDate || birthdate);
                            if (Platform.OS === 'android') {
                                setShowDatePicker(false);
                            }
                        }}
                    />
                )}
            </ThemedView>

            <PrimaryButton style={styles.button} onPress={handleSubmit} text={t("save")} />
        </ThemedSafeArea>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: 32,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    photoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    photoWrapper: {
        position: 'relative',
        width: 120,
        height: 120,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    photoButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        zIndex: 1,
        borderRadius: 6,
        aspectRatio: 1,
        width: 28,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    selectPhotoButton: {
        width: 120,
        height: 120,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },

    birthdateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    button: {
        marginTop: "auto",
    },
});

export default ContactForm;
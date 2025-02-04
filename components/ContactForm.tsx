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
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = () => {
        if (!name || !phone || !email || !photo || !birthdate) {
            Alert.alert('Error', t('fillAllFields'));
            return;
        }

        if (!validatePhoneNumber(phone)) {
            Alert.alert('Error', t('invalidPhone'));
            return;
        }

        const formattedbirthdate = birthdate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        onSubmit({ name, phone, email, photo, birthdate: formattedbirthdate });
    };

    return (
        <ThemedSafeArea style={[styles.safeArea]}>
            <View style={styles.titleContainer}>
                <ThemedText type="title">
                    {contact ? t('editContact') : t('addContact')}
                </ThemedText>
                <TextButton title={t("cancel")} onPress={onCancel} color={accent} type="defaultSemiBold" />
            </View>
            <Text style={[styles.label, { color }]}>Name</Text>
            <TextInput
                style={[styles.input, { color }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={color}
            />

            <Text style={[styles.label, { color }]}>Phone</Text>
            <TextInput
                style={[styles.input, { color }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor={color}
            />

            <Text style={[styles.label, { color }]}>Email</Text>
            <TextInput
                style={[styles.input, { color }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter email"
                placeholderTextColor={color}
            />

            <Text style={[styles.label, { color }]}>birthdate</Text>

            {Platform.OS === 'android' && !showDatePicker && (
                <TextButton title="Select Date" onPress={() => setShowDatePicker(true)} color={accent} type="defaultSemiBold" />
            )}
            {(Platform.OS === 'ios' || showDatePicker) && (
                <DateTimePicker
                    value={birthdate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        // En Android, ocultamos el picker cuando se cierra o se descarta
                        if (Platform.OS === 'android') {
                            setShowDatePicker(false);
                        }
                        setBirthdate(selectedDate || birthdate);
                    }}
                />
            )}


            <Text style={[styles.label, { color }]}>Pick a Photo</Text>
            <View style={{ alignItems: 'center' }}>
                {photo ? (
                    <View style={{ gap: 10, flexDirection: 'column', alignItems: 'center' }}>
                        <Image source={{ uri: photo } as ImageURISource} style={styles.photo} />
                        <SecondaryButton onPress={pickImage} text="Change Image" />
                    </View>
                ) : (
                    <SecondaryButton onPress={pickImage} text="Pick Image" />
                )}
            </View>

            <View style={{ flex: 1 }} />

            <PrimaryButton onPress={handleSubmit} text={t("save")} />
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
    photo: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    button: {
        marginTop: 20,
    },
});

export default ContactForm;
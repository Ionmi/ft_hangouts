import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, StyleSheet, Image, ImageURISource, View } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { type Contact } from '../types/Contact';
import { useAccentStyle } from '../contexts/HeaderStyleContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { IconSymbol } from '../components/ui/IconSymbol';

export default function Contact() {
    const params = useLocalSearchParams();
    const { color } = useAccentStyle();
    const textColor = useThemeColor({}, 'text');
    const {
        name,
        phone,
        email,
        birthdate,
        photo,
    } = params as unknown as Contact
    const { t } = useLanguage();

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    navigationBarHidden: true,
                    title: name,
                    headerBackTitle: t('back'),
                    headerTintColor: textColor,
                    headerStyle: {
                        backgroundColor: color,
                    }
                }}
            />

            <Image source={{ uri: photo } as ImageURISource} style={styles.photo} />
            <ThemedText type="title" style={[styles.name, { color: textColor }]}>{name}</ThemedText>
            <ThemedView style={styles.textContainer}>
                <IconSymbol name="phone.fill" color={textColor} size={24} />
                <ThemedText type='defaultSemiBold' style={[styles.phone, { color: textColor }]}>{phone}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.textContainer}>
                <IconSymbol name="envelope.fill" color={textColor} size={24} />
                <ThemedText type='defaultSemiBold' style={[styles.email, { color: textColor }]}>{email}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.textContainer}>
                <IconSymbol name="calendar" color={textColor} size={24} />
                <ThemedText type='defaultSemiBold' style={[styles.birthdate, { color: textColor }]}>{birthdate}</ThemedText>
            </ThemedView>


        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        gap: 4
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
        color: '#666',
    },
});

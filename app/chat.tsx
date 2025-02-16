import { Stack, useLocalSearchParams } from "expo-router";
import { useAccentStyle } from "../contexts/HeaderStyleContext";
import { useThemeColor } from "../hooks/useThemeColor";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import Button from "../components/ui/Button";
import { IconSymbol } from "../components/ui/IconSymbol";
import { View, StyleSheet, TextInput, FlatList, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { Contact } from "../types/Contact";
import { useContacts } from "../contexts/ContactsContext";
import { sendSMS, Sms } from "../modules/sms";
import { useLanguage } from "../contexts/LanguageContext";
import { useSms } from "../contexts/SmsContext";

export default function Chat() {
    const params = useLocalSearchParams();
    const textColor = useThemeColor({}, 'text');
    const { color } = useAccentStyle();
    const [contact] = useState<Contact>(params as unknown as Contact);
    const { contactsWithMessages } = useContacts();
    const [messages, setMessages] = useState<Sms[]>(contactsWithMessages.find((c) => c.contact.id == contact.id)?.messages || []);
    const [inputText, setInputText] = useState('');
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList<Sms>>(null);
    const { readMessages } = useSms();

    useEffect(() => {
        setMessages(contactsWithMessages.find((c) => c.contact.id == contact.id)?.messages || []);
        flatListRef.current?.scrollToOffset({ animated: true, offset: messages.length * 1000 });

    }, [contactsWithMessages]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        if (!sendSMS(contact.phone, inputText)) return;
        setInputText('');
        await readMessages();
    };

    return (
        <ThemedView style={[styles.container, { paddingBottom: 50 + insets.bottom }]}>
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: color,
                    },
                    headerTintColor: textColor,
                    headerTitle: contact.name,
                }}
            />
            <KeyboardAvoidingView
                style={styles.container}
                keyboardVerticalOffset={20}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages.sort((a, b) => a.date - b.date)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.messageContainer, item.type === "sent" ? styles.userMessage : styles.contactMessage]}>
                            <ThemedText style={styles.messageText}>{item.body}</ThemedText>
                        </View>
                    )}
                    contentContainerStyle={styles.messagesList}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={t('message')}
                        placeholderTextColor={textColor}
                    />
                    <Button style={{ backgroundColor: color, borderRadius: 10 }} onPress={sendMessage}>
                        <IconSymbol name="paperplane.fill" size={24} color={textColor} />
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        flex: 1,
        marginBottom: 16,
        padding: 10,
        borderRadius: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    contactMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ccc',
    },
    messageText: {
        fontSize: 16,
    },
    messageSender: {
        fontSize: 12,
        color: 'gray',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginRight: 16,
    },
});
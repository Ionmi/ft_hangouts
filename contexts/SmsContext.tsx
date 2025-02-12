import React, { ReactNode, useEffect } from "react";
import { addSmsListener, readSMS, Sms } from "../modules/sms";
import { useLanguage } from "./LanguageContext";
import { getContacts, saveContact } from "../db/sqliteService";
import { useSQLiteContext } from "expo-sqlite";
import { Contact } from "../types/Contact";

const SmsContext = React.createContext<{
    messages: Sms[];
    setMessages: React.Dispatch<React.SetStateAction<Sms[]>>;
} | undefined>(undefined);

interface SmsProviderProps {
    children: ReactNode;
}

export const SmsProvider: React.FC<SmsProviderProps> = ({ children }) => {
    const [messages, setMessages] = React.useState<Sms[]>([]);
    const { t } = useLanguage();
    const db = useSQLiteContext();

    useEffect(() => {
        const handleSmsReceived = async (event: Sms) => {
            const result = await getContacts(db);

            if (!result.some((contact) => contact.phone === event.address)) {
                const newContact: Contact = {
                    name: event.address,
                    phone: event.address,
                    email: '',
                    birthdate: '',
                    photo: '',
                };

                await saveContact(db, newContact);
            }

            setMessages((prev) => [event, ...prev]);
        }

        const subscription = addSmsListener('onSmsReceived', handleSmsReceived);

        readSMS().then(setMessages)


        return () => {
            subscription.remove();
        };
    }, [t]);

    return (
        <SmsContext.Provider value={{ messages, setMessages }}>
            {children}
        </SmsContext.Provider>
    );
}

export const useSms = () => {
    const context = React.useContext(SmsContext);
    if (!context) {
        throw new Error('useSms must be used within a SmsProvider');
    }
    return context;
}
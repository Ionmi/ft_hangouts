import React, { ReactNode, useEffect } from "react";
import { addSmsListener, readSMS } from "../modules/sms";
import { useLanguage } from "./LanguageContext";

const SmsContext = React.createContext<{ messages: string[]; setMessages: React.Dispatch<React.SetStateAction<string[]>> } | undefined>(undefined);

interface SmsProviderProps {
    children: ReactNode;
}

export const SmsProvider: React.FC<SmsProviderProps> = ({ children }) => {
    const [messages, setMessages] = React.useState<string[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const handleSmsReceived = (event: { sender: string; message: string }) => {
            console.log('Received SMS event:', event);
            setMessages(prev => [
                `From: ${event.sender}, Message: ${event.message}`,
                ...prev,
            ]);
        };

        // Directly use SmsModule.addListener as it is already an EventEmitter.
        const subscription = addSmsListener('onSmsReceived', handleSmsReceived);

        // Read existing SMS messages.
        readSMS().then(setMessages);


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
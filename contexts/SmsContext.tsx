import React, { ReactNode, useEffect } from "react";
import { Platform, PermissionsAndroid, Alert } from "react-native";
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
        console.log('SMS listener added');

        // Request permissions and fetch SMS messages
        const requestSmsPermissions = async () => {
            try {
                if (Platform.OS === 'android') {
                    const permissions = [
                        PermissionsAndroid.PERMISSIONS.READ_SMS,
                        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                    ];
                    const grantedPermissions = await PermissionsAndroid.requestMultiple(permissions);
                    const allGranted = permissions.every(
                        permission => grantedPermissions[permission] === PermissionsAndroid.RESULTS.GRANTED
                    );
                    if (allGranted) {
                        const smsMessages = await readSMS();
                        setMessages(smsMessages);
                    } else {
                        Alert.alert(t("permissionDeniedTitle"), t("permissionDeniedMessage"));
                    }
                }
            } catch (err) {
                console.warn(err);
            }
        };

        requestSmsPermissions();

        return () => {
            console.log('Cleaning up SMS listener');
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
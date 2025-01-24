import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

type Language = 'en' | 'es';

type Translations = {
    [key: string]: string;
};

const translations: Record<Language, Translations> = { en, es };

interface LanguageContextProps {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en'); // Default language

    useEffect(() => {
        const loadLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem('language');
            if (storedLanguage) {
                setLanguageState(storedLanguage as Language);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (newLanguage: Language) => {
        setLanguageState(newLanguage);
        await AsyncStorage.setItem('language', newLanguage);
    };

    const translate = (key: string): string => {
        return translations[language][key] || key; // Fallback to the key if no translation is found
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextProps => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
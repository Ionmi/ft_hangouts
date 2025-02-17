import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAccentStyle } from '@/contexts/HeaderStyleContext';
import { HeaderColorPairs } from '@/constants/HeaderColors';
import { IconSymbol } from './ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const ChangeLanguageButton = () => {
    const { language, setLanguage } = useLanguage();
    const { colors: backgroundColor } = useAccentStyle();
    const colorScheme = useColorScheme() ?? 'light';
    const iconColor = useThemeColor({}, 'text');

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: backgroundColor[colorScheme],
                    opacity: pressed ? 0.7 : 1,
                },
            ]}
            onPress={() => {
                toggleLanguage();
            }}
        >
            <Text style={[styles.text, { color: iconColor }]}>
                {language === 'en' ? 'ES' : 'EN'}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row', // Aligns the icon and text horizontally
        alignItems: 'center', // Centers elements vertically
        justifyContent: 'center', // Centers elements horizontally
        borderRadius: 5,
        height: 32,
        width: 48,
    },
    text: {
        fontSize: 14,
    },
});

export default ChangeLanguageButton;
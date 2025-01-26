import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useAccentStyle } from '@/contexts/HeaderStyleContext';
import { HeaderColorPairs } from '@/constants/HeaderColors';
import { IconSymbol } from './ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from 'react-native';

const ChangeColorButton = () => {
    const { colors: backgroundColor, setColor: setBackgroundColor } = useAccentStyle();
    const colorScheme = useColorScheme() ?? 'light';
    const iconColor = useThemeColor({}, 'text');

    const getRandomPair = (currentPair: { light: string, dark: string }) => {
        let randomIndex;
        const currentIndex = HeaderColorPairs.findIndex(
            (pair) => pair.light === currentPair.light
        );
        do {
            randomIndex = Math.floor(Math.random() * HeaderColorPairs.length);
        } while (randomIndex === currentIndex);
        return HeaderColorPairs[randomIndex];
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
            onPress={() => setBackgroundColor(getRandomPair(backgroundColor))}
        >
            <IconSymbol name="dice" size={16} color={iconColor} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row', // Alinea el icono y el texto horizontalmente
        alignItems: 'center', // Centra verticalmente los elementos
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
});

export default ChangeColorButton;
import React, { PropsWithChildren } from 'react';
import { OpaqueColorValue, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useAccentStyle } from '@/contexts/HeaderStyleContext';
import { useColorScheme } from 'react-native';

type Props = PropsWithChildren<{
    color?: string | OpaqueColorValue;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}>;

const FilledButton = ({
    children,
    color,
    style,
    onPress,
}: Props) => {
    const { colors: backgroundColor } = useAccentStyle();
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: color ?? backgroundColor[colorScheme],
                    opacity: pressed ? 0.7 : 1,
                },
                style,
            ]}
            onPress={onPress}
        >
            {children}
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

export default FilledButton;
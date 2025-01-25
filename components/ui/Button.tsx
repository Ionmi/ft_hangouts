import React, { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type Props = PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}>;

const Button = ({
    children,
    style,
    onPress,
}: Props) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
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

export default Button;
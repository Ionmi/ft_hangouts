import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = PropsWithChildren<{
    color?: string;
    title: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
    onPress?: () => void;
}>;

const TextButton = ({
    onPress,
    title,
    color,
    ...rest
}: Props) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    opacity: pressed ? 0.7 : 1,
                },
            ]}
            onPress={onPress}
        >
            <ThemedText darkColor={color} lightColor={color} {...rest} >
                {title}
            </ThemedText>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
});

export default TextButton;
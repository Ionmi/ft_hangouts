import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import FilledButton from "./FilledButton";
import { IconSymbol, IconSymbolName } from "./IconSymbol";
import { Text } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";

type Props = {
    text: string;
    icon?: IconSymbolName | undefined;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

export const PrimaryButton = ({ text, icon, onPress, style }: Props) => {
    const color = useThemeColor({}, 'text');
    return (
        <FilledButton
            onPress={onPress}
            style={[styles.button, style]}
        >
            {icon && <IconSymbol name={icon} size={24} color={color} />}
            <Text style={[{ color }, styles.text]} >{text}</Text>
        </FilledButton>
    )
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        gap: 8,
        height: 42,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
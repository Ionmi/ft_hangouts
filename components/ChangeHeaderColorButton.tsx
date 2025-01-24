import { useHeaderStyle } from '@/contexts/HeaderStyleContext';
import React from 'react';

import { HeaderColorPairs } from '@/constants/HeaderColors';
import { Button } from 'react-native-elements';
import { IconSymbol } from './ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

const ChangeColorButton = () => {
    const { backgroundColor, setBackgroundColor } = useHeaderStyle();
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'text');
    const buttonColor = useThemeColor({}, 'icon');

    const getNextPair = (currentPair: { light: string, dark: string }) => {
        const currentIndex = HeaderColorPairs.findIndex((pair) => pair.light === currentPair.light);
        const nextIndex = (currentIndex + 1) % HeaderColorPairs.length;
        return HeaderColorPairs[nextIndex];
    };

    return (
        <Button
            icon={<IconSymbol name="dice" size={16} color={iconColor} />}
            buttonStyle={{ backgroundColor: buttonColor, borderRadius: 5, gap: 8 }}
            onPress={() => setBackgroundColor(getNextPair(backgroundColor))}
            title="Change Color"
            titleStyle={{ color: textColor, fontSize: 16 }}
        />
    );
};

export default ChangeColorButton;
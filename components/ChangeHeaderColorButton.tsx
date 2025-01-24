import { useHeaderStyle } from '@/contexts/HeaderStyleContext';
import React from 'react';
import { Button } from 'react-native';

import { HeaderColorPairs } from '@/constants/HeaderColors';

const ChangeColorButton = () => {
    const { backgroundColor, setBackgroundColor } = useHeaderStyle();

    const getNextPair = (currentPair: { light: string, dark: string }) => {
        const currentIndex = HeaderColorPairs.findIndex((pair) => pair.light === currentPair.light);
        const nextIndex = (currentIndex + 1) % HeaderColorPairs.length;
        return HeaderColorPairs[nextIndex];
    };

    return (
        <Button
            title="Change Background Color"
            onPress={() => setBackgroundColor(getNextPair(backgroundColor))}
        />
    );
};

export default ChangeColorButton;
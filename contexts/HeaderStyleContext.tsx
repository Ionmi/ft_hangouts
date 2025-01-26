// filepath: /Users/ionmi/Development/42/ft_hangouts/contexts/HeaderStyleContext.tsx
import { HeaderColorPairs } from '@/constants/HeaderColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';

interface HeaderStyleContextType {
  colors: { light: string; dark: string };
  color: string;
  setColor: React.Dispatch<React.SetStateAction<{ light: string; dark: string }>>;
}

const defaultContextValue: HeaderStyleContextType = {
  colors: HeaderColorPairs[0],
  color: HeaderColorPairs[0].light,
  setColor: () => { },
};

const HeaderStyleContext = createContext<HeaderStyleContextType>(defaultContextValue);

interface HeaderStyleProviderProps {
  children: React.ReactNode;
}

export const HeaderStyleProvider: React.FC<HeaderStyleProviderProps> = ({ children }) => {
  const [colors, setColor] = useState(defaultContextValue.colors);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    const loadBackgroundColor = (async () => {
      try {
        const storedColor = await AsyncStorage.getItem('backgroundColor');
        if (storedColor) {
          setColor(JSON.parse(storedColor));
        }
      } catch (error) {
        console.error('Failed to load background color:', error);
      }
    })

    loadBackgroundColor();
  }, []);

  useEffect(() => {
    const saveBackgroundColor = async () => {
      try {
        await AsyncStorage.setItem('backgroundColor', JSON.stringify(colors));
      } catch (error) {
        console.error('Failed to save background color:', error);
      }
    };

    saveBackgroundColor();
  }, [colors]);

  return (
    <HeaderStyleContext.Provider value={{ color: colors[colorScheme], colors, setColor }}>
      {children}
    </HeaderStyleContext.Provider>
  );
};

export const useAccentStyle = () => useContext(HeaderStyleContext);
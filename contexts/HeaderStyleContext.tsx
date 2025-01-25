// filepath: /Users/ionmi/Development/42/ft_hangouts/contexts/HeaderStyleContext.tsx
import { HeaderColorPairs } from '@/constants/HeaderColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface HeaderStyleContextType {
  color: { light: string; dark: string };
  setColor: React.Dispatch<React.SetStateAction<{ light: string; dark: string }>>;
}

const defaultContextValue: HeaderStyleContextType = {
  color: HeaderColorPairs[0],
  setColor: () => { },
};

const HeaderStyleContext = createContext<HeaderStyleContextType>(defaultContextValue);

interface HeaderStyleProviderProps {
  children: React.ReactNode;
}

export const HeaderStyleProvider: React.FC<HeaderStyleProviderProps> = ({ children }) => {
  const [color, setColor] = useState(defaultContextValue.color);

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
        await AsyncStorage.setItem('backgroundColor', JSON.stringify(color));
      } catch (error) {
        console.error('Failed to save background color:', error);
      }
    };

    saveBackgroundColor();
  }, [color]);

  return (
    <HeaderStyleContext.Provider value={{ color: color, setColor: setColor }}>
      {children}
    </HeaderStyleContext.Provider>
  );
};

export const useAccentStyle = () => useContext(HeaderStyleContext);
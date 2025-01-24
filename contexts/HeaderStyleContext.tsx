// filepath: /Users/ionmi/Development/42/ft_hangouts/contexts/HeaderStyleContext.tsx
import { HeaderColorPairs } from '@/constants/HeaderColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface HeaderStyleContextType {
  backgroundColor: { light: string; dark: string };
  setBackgroundColor: React.Dispatch<React.SetStateAction<{ light: string; dark: string }>>;
}

const defaultContextValue: HeaderStyleContextType = {
  backgroundColor: HeaderColorPairs[0],
  setBackgroundColor: () => { },
};

const HeaderStyleContext = createContext<HeaderStyleContextType>(defaultContextValue);

interface HeaderStyleProviderProps {
  children: React.ReactNode;
}

export const HeaderStyleProvider: React.FC<HeaderStyleProviderProps> = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState(defaultContextValue.backgroundColor);

  useEffect(() => {
    const loadBackgroundColor = (async () => {
      try {
        const storedColor = await AsyncStorage.getItem('backgroundColor');
        if (storedColor) {
          setBackgroundColor(JSON.parse(storedColor));
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
        await AsyncStorage.setItem('backgroundColor', JSON.stringify(backgroundColor));
      } catch (error) {
        console.error('Failed to save background color:', error);
      }
    };

    saveBackgroundColor();
  }, [backgroundColor]);

  return (
    <HeaderStyleContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </HeaderStyleContext.Provider>
  );
};

export const useHeaderStyle = () => useContext(HeaderStyleContext);
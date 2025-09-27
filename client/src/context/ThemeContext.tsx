import { createContext } from 'react';

interface themeContextType {
  theme: 'light' | 'dark';
  setLightTheme: () => void;
  setDarkTheme: () => void;
}

export const ThemeContext = createContext<themeContextType | null>(null);

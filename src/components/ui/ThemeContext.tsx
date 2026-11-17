import React, { createContext, useContext } from 'react';

export type UiTheme = 'light' | 'dark';

const ThemeContext = createContext<UiTheme>('dark');

export const UiThemeProvider: React.FC<{ theme: UiTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useUiTheme = (): UiTheme => {
  return useContext(ThemeContext);
};

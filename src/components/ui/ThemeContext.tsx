import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiTheme = 'light' | 'dark';

export interface ThemeControls {
  theme: UiTheme;
  toggleTheme: () => void;
  setTheme: (t: UiTheme) => void;
}

const ThemeContext = createContext<ThemeControls>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const UiThemeProvider: React.FC<{ 
  theme?: UiTheme; 
  defaultTheme?: UiTheme;
  children: React.ReactNode 
}> = ({
  theme: controlledTheme,
  defaultTheme = 'light',
  children,
}) => {
  const [internalTheme, setInternalTheme] = useState<UiTheme>(() => {
    if (controlledTheme) return controlledTheme;
    const saved = localStorage.getItem('glamoure_ui_theme') as UiTheme;
    return saved === 'dark' || saved === 'light' ? saved : defaultTheme;
  });

  const activeTheme = controlledTheme || internalTheme;

  const setTheme = (t: UiTheme) => {
    setInternalTheme(t);
    localStorage.setItem('glamoure_ui_theme', t);
  };

  const toggleTheme = () => {
    const next = activeTheme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  useEffect(() => {
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Returns 'light' | 'dark' for direct styling
export const useUiTheme = (): UiTheme => {
  return useContext(ThemeContext).theme;
};

// Returns full controls for toggling
export const useThemeControls = (): ThemeControls => {
  return useContext(ThemeContext);
};

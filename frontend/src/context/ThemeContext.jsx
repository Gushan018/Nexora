<<<<<<< HEAD
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
<<<<<<< HEAD
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('nexora-theme');
    if (saved === 'dark' || saved === 'light') return saved;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexora-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    setTimeout(() => root.classList.remove('theme-transition'), 350);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
=======
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    
    // Then check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply theme to HTML element
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
      {children}
    </ThemeContext.Provider>
  );
};

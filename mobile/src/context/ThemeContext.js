// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const THEME_KEY = 'app_theme'

export const fonts = {
  body: 'SchibstedGrotesk_400Regular',
  bodyBold: 'SchibstedGrotesk_700Bold',
  heading: 'Besley_400Regular',
  headingBold: 'Besley_700Bold',
}

export const lightTheme = {
  dark: false,
  
  // Background Colors
  bg: '#ffffff',                    // --bg-primary
  bgSecondary: '#f0f5f2',           // --bg-secondary (light green tint)
  bgCard: '#ffffff',                // --bg-card
  
  // Border Colors
  border: 'rgba(209, 213, 219, 0.7)', // --border
  
  // Text Colors
  text: '#111111',                  // --text-primary
  textSecondary: '#4b5563',         // --text-secondary
  textMuted: '#6b7280',
  
  // Accent Colors
  accent: '#143829',                // --accent (dark green)
  accentLight: '#1a4a35',
  accentText: '#ffffff',            // --accent-text
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  errorBg: '#fef2f2',
  
  // Shadow
  shadow: '0 1px 3px rgba(0,0,0,0.1)',
}

export const darkTheme = {
  dark: true,
  
  // Background Colors
  bg: '#0f0f0f',                    // --bg-primary (dark)
  bgSecondary: '#151c19',           // --bg-secondary (dark green tint)
  bgCard: '#0b0b0b',                // --bg-card (dark)
  
  // Border Colors
  border: '#2e2e2e',                // --border (dark)
  
  // Text Colors
  text: '#bed0be',                  // --text-primary (dark)
  textSecondary: '#9ca3af',         // --text-secondary (dark)
  textMuted: '#555555',
  
  // Accent Colors
  accent: '#8fc6a3',                // --accent (dark mode)
  accentLight: '#b4daae',
  accentText: '#0f0f0f',            // --accent-text (dark)
  
  // Status Colors
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  errorBg: '#2a0a0a',
  
  // Shadow
  shadow: '0 1px 3px rgba(0,0,0,0.4)',
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val !== null) setIsDark(val === 'dark')
    })
  }, [])

  const toggleTheme = async () => {
    const next = !isDark
    setIsDark(next)
    await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, fonts }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
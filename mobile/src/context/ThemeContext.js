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
  bg: '#ffffff',
  bgSecondary: '#f4f4f4',
  bgCard: '#ebebeb',
  border: '#dddddd',
  text: '#0a0a0a',
  textSecondary: '#555555',
  textMuted: '#888888',
  accent: '#c8f25d',
  accentText: '#0a0a0a',
  error: '#cc0000',
  errorBg: '#fff0f0',
}

export const darkTheme = {
  dark: true,
  bg: '#0a0a0a',
  bgSecondary: '#161616',
  bgCard: '#1e1e1e',
  border: '#2a2a2a',
  text: '#f0f0f0',
  textSecondary: '#aaaaaa',
  textMuted: '#555555',
  accent: '#c8f25d',
  accentText: '#0a0a0a',
  error: '#ff4444',
  errorBg: '#2a0a0a',
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
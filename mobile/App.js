// App.js
import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import * as ExpoLinking from 'expo-linking'
import { useFonts, SchibstedGrotesk_400Regular, SchibstedGrotesk_500Medium, SchibstedGrotesk_700Bold } from '@expo-google-fonts/schibsted-grotesk'
import { Besley_400Regular, Besley_700Bold } from '@expo-google-fonts/besley'
import { ThemeProvider } from './src/context/ThemeContext'
import AppNavigator from './src/navigation/AppNavigator'

const linking = {
  prefixes: [ExpoLinking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          OAuth2Success: 'oauth2/success',
          CompleteRegistration: 'complete-registration',
        },
      },
    },
  },
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_700Bold,
    Besley_400Regular,
    Besley_700Bold,
  })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#c8f25d" size="large" />
      </View>
    )
  }

  return (
    <ThemeProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}
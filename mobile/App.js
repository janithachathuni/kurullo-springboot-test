// App.js
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import * as ExpoLinking from 'expo-linking'
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
  return (
    <ThemeProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}
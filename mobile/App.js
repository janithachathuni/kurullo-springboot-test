// App.js
//
// Install dependencies first:
//   npx expo install @react-navigation/native @react-navigation/native-stack
//   npx expo install react-native-screens react-native-safe-area-context
//   npx expo install @react-native-async-storage/async-storage
//   npx expo install expo-linking

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import * as ExpoLinking from 'expo-linking'
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
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  )
}
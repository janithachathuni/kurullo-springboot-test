// src/navigation/AuthNavigator.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import OAuth2SuccessScreen from '../screens/OAuth2SuccessScreen'
import CompleteRegistrationScreen from '../screens/CompleteRegistrationScreen'

const Stack = createNativeStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OAuth2Success" component={OAuth2SuccessScreen} />
      <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} />
    </Stack.Navigator>
  )
}
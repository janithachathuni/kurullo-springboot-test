// src/navigation/MainNavigator.js
//
// Add all your post-login screens here.
// For tab-based navigation, swap createNativeStackNavigator for
// createBottomTabNavigator (install @react-navigation/bottom-tabs).

import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import DashboardScreen from '../screens/DashboardScreen'
// import ProfileScreen from '../screens/ProfileScreen'
// import SettingsScreen from '../screens/SettingsScreen'
// ... add more screens here as you build them

const Stack = createNativeStackNavigator()

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
    </Stack.Navigator>
  )
}
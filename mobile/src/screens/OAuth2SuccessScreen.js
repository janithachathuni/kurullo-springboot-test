// src/screens/OAuth2SuccessScreen.js
//
// This screen opens the backend Google OAuth URL in the system browser via Linking.
// Your backend should redirect back to your app using a deep link, e.g.:
//   yourapp://oauth2/success?token=xxx&role=xxx&isFirstLogin=true&profileCompleted=false
//
// Setup required:
//   1. In app.json add: "scheme": "yourapp"
//   2. Install expo-linking: npx expo install expo-linking
//   3. Configure your backend redirect URI to: yourapp://oauth2/success

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ExpoLinking from 'expo-linking'

export default function OAuth2SuccessScreen({ navigation, route }) {
  const [status, setStatus] = useState('Opening Google login...')
  const oauthUrl = route?.params?.url

  useEffect(() => {
    // Open the backend OAuth URL in the system browser
    if (oauthUrl) {
      Linking.openURL(oauthUrl)
    }

    // Listen for the deep link redirect back from the backend
    const subscription = ExpoLinking.addEventListener('url', handleRedirect)

    return () => subscription.remove()
  }, [])

  const handleRedirect = async ({ url }) => {
    try {
      setStatus('Processing login...')
      const parsed = ExpoLinking.parse(url)
      const { token, role, isFirstLogin, profileCompleted } = parsed.queryParams || {}

      if (!token) {
        setStatus('Login failed. Please try again.')
        setTimeout(() => navigation.navigate('Login'), 2000)
        return
      }

      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('role', role || '')

      const firstLogin = isFirstLogin === 'true'
      const profileDone = profileCompleted === 'true'

      if (firstLogin || !profileDone) {
        navigation.replace('CompleteRegistration')
      } else {
        navigation.replace('Dashboard')
      }
    } catch (err) {
      setStatus('Something went wrong. Redirecting...')
      setTimeout(() => navigation.navigate('Login'), 2000)
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#c8f25d" style={styles.spinner} />
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.hint}>
        Complete sign-in in the browser window that opened.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  spinner: { marginBottom: 24 },
  status: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  hint: {
    color: '#444',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
})
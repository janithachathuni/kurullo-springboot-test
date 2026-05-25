// src/screens/CompleteRegistrationScreen.js
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import * as ExpoLinking from 'expo-linking'

const API_BASE = 'http://localhost:8080/api/auth/complete-google-registration' // ← same IP as other screens

export default function CompleteRegistrationScreen({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [googleId, setGoogleId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Pull email + googleId from the deep link query params if present
    ExpoLinking.getInitialURL().then((url) => {
      if (url) {
        const parsed = ExpoLinking.parse(url)
        const params = parsed.queryParams || {}
        if (params.email) setEmail(params.email)
        if (params.googleId) setGoogleId(params.googleId)
      }
    })
  }, [])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/complete-google-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, googleId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      navigation.replace('Login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ALMOST THERE</Text>
          <Text style={styles.title}>One Last{'\n'}Step</Text>
          <View style={styles.titleAccent} />
          <Text style={styles.subtitle}>
            Just pick a username to finish setting up your account.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          {/* Email (read-only) */}
          {email ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={styles.inputDisabledText}>{email}</Text>
              </View>
            </View>
          ) : null}

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>USERNAME</Text>
            <TextInput
              style={styles.input}
              placeholder="cooluser123"
              placeholderTextColor="#555"
              autoCapitalize="none"
              autoFocus
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0a0a0a" />
            ) : (
              <Text style={styles.btnPrimaryText}>COMPLETE REGISTRATION</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0a0a0a' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#0a0a0a',
  },

  header: { marginBottom: 40 },
  eyebrow: {
    color: '#c8f25d',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    color: '#f0f0f0',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 46,
  },
  titleAccent: {
    width: 40,
    height: 3,
    backgroundColor: '#c8f25d',
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 2,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    lineHeight: 22,
  },

  errorBox: {
    backgroundColor: '#2a0a0a',
    borderLeftWidth: 3,
    borderLeftColor: '#ff4444',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 24,
  },
  errorText: { color: '#ff6666', fontSize: 13 },

  form: { gap: 20 },
  inputGroup: { gap: 6 },
  label: {
    color: '#555',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f0f0f0',
    fontSize: 15,
  },
  inputDisabled: {
    backgroundColor: '#111',
    borderColor: '#1e1e1e',
    justifyContent: 'center',
  },
  inputDisabledText: {
    color: '#444',
    fontSize: 15,
  },

  btn: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnPrimary: { backgroundColor: '#c8f25d' },
  btnPrimaryText: {
    color: '#0a0a0a',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  btnDisabled: { opacity: 0.5 },
})
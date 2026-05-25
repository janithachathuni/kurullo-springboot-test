// src/screens/LoginScreen.js
import React, { useState } from 'react'
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
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE = 'http://10.249.117.165:8080' // ← replace with your machine's local IP (not localhost)

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value })
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('role', data.role)

      if (data.isFirstLogin || !data.profileCompleted) {
        navigation.replace('CompleteRegistration')
      } else {
        navigation.replace('Main')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Opens the backend OAuth2 flow in the system browser
    // The backend should redirect to your app's deep link on success
    // See OAuth2SuccessScreen.js and app.json (scheme) for setup
    navigation.navigate('OAuth2Success', { url: `${API_BASE}/oauth2/authorization/google` })
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
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.title}>Sign In</Text>
          <View style={styles.titleAccent} />
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => handleChange('email', v)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#555"
              secureTextEntry
              value={form.password}
              onChangeText={(v) => handleChange('password', v)}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0a0a0a" />
            ) : (
              <Text style={styles.btnPrimaryText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google */}
        <TouchableOpacity
          style={[styles.btn, styles.btnGoogle]}
          onPress={handleGoogleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.btnGoogleText}>G  Continue with Google</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Register</Text>
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

  // Header
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
  },
  titleAccent: {
    width: 40,
    height: 3,
    backgroundColor: '#c8f25d',
    marginTop: 10,
    borderRadius: 2,
  },

  // Error
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

  // Form
  form: { gap: 20, marginBottom: 32 },
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

  // Buttons
  btn: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#c8f25d' },
  btnPrimaryText: {
    color: '#0a0a0a',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  btnDisabled: { opacity: 0.5 },
  btnGoogle: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  btnGoogleText: { color: '#f0f0f0', fontWeight: '600', fontSize: 14 },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1e1e1e' },
  dividerText: { color: '#333', fontSize: 11, fontWeight: '600', letterSpacing: 2 },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
  },
  footerText: { color: '#444', fontSize: 14 },
  footerLink: { color: '#c8f25d', fontSize: 14, fontWeight: '700' },
})
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
import { useTheme, fonts } from '../context/ThemeContext'

const API_BASE = 'http://10.27.238.165:8080' // ← replace with your machine's local IP (not localhost)

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme()
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
    navigation.navigate('OAuth2Success', { url: `${API_BASE}/oauth2/authorization/google` })
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.bg }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>WELCOME BACK</Text>
          <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
          <View style={[styles.titleAccent, { backgroundColor: theme.accent }]} />
        </View>

        {/* Error */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.errorBg, borderLeftColor: theme.error }]}>
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>EMAIL</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.bgSecondary, 
                borderColor: theme.border,
                color: theme.text 
              }]}
              placeholder="you@example.com"
              placeholderTextColor={theme.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => handleChange('email', v)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>PASSWORD</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.bgSecondary, 
                borderColor: theme.border,
                color: theme.text 
              }]}
              placeholder="••••••••"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              value={form.password}
              onChangeText={(v) => handleChange('password', v)}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.btn, 
              styles.btnPrimary, 
              loading && styles.btnDisabled,
              { backgroundColor: theme.accent }
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={theme.accentText} />
            ) : (
              <Text style={[styles.btnPrimaryText, { color: theme.accentText }]}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.textMuted }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        {/* Google */}
        <TouchableOpacity
          style={[
            styles.btn, 
            styles.btnGoogle,
            { 
              backgroundColor: theme.bgSecondary, 
              borderColor: theme.border 
            }
          ]}
          onPress={handleGoogleLogin}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnGoogleText, { color: theme.text }]}>G  Continue with Google</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: theme.accent }]}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },

  // Header
  header: { marginBottom: 40 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    fontFamily: 'Besley_700Bold',  // ← Besley font applied here
  },
  titleAccent: {
    width: 40,
    height: 3,
    marginTop: 10,
    borderRadius: 2,
  },

  // Error
  errorBox: {
    borderLeftWidth: 3,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 24,
  },
  errorText: { fontSize: 13 },

  // Form
  form: { gap: 20, marginBottom: 32 },
  inputGroup: { gap: 6 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  // Buttons
  btn: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {},
  btnPrimaryText: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  btnDisabled: { opacity: 0.5 },
  btnGoogle: {
    borderWidth: 1,
  },
  btnGoogleText: { 
    fontWeight: '600', 
    fontSize: 14 
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: '600', letterSpacing: 2 },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
  },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
})
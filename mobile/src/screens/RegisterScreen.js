// src/screens/RegisterScreen.js
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

const API_BASE = 'http://10.249.117.165:8080' // ← same IP as LoginScreen

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value })
  }

  const handleRegister = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setSuccess('Account created! You can now log in.')
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
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>GET STARTED</Text>
          <Text style={styles.title}>Create{'\n'}Account</Text>
          <View style={styles.titleAccent} />
        </View>

        {/* Feedback */}
        {error ? (
          <View style={styles.feedbackBox(false)}>
            <Text style={styles.feedbackText(false)}>{error}</Text>
          </View>
        ) : null}
        {success ? (
          <View style={styles.feedbackBox(true)}>
            <Text style={styles.feedbackText(true)}>{success}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>USERNAME</Text>
            <TextInput
              style={styles.input}
              placeholder="cooluser123"
              placeholderTextColor="#555"
              autoCapitalize="none"
              value={form.username}
              onChangeText={(v) => handleChange('username', v)}
            />
          </View>

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
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#0a0a0a" />
            ) : (
              <Text style={styles.btnPrimaryText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

          {/* Navigate to login after success */}
          {success ? (
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnOutlineText}>GO TO LOGIN →</Text>
            </TouchableOpacity>
          ) : null}
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
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Login</Text>
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
    borderRadius: 2,
  },

  feedbackBox: (isSuccess) => ({
    backgroundColor: isSuccess ? '#0a2a0a' : '#2a0a0a',
    borderLeftWidth: 3,
    borderLeftColor: isSuccess ? '#4caf50' : '#ff4444',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 24,
  }),
  feedbackText: (isSuccess) => ({
    color: isSuccess ? '#66bb6a' : '#ff6666',
    fontSize: 13,
  }),

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
  btnOutline: {
    borderWidth: 1,
    borderColor: '#c8f25d',
  },
  btnOutlineText: {
    color: '#c8f25d',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
  btnGoogle: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  btnGoogleText: { color: '#f0f0f0', fontWeight: '600', fontSize: 14 },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1e1e1e' },
  dividerText: { color: '#333', fontSize: 11, fontWeight: '600', letterSpacing: 2 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
  },
  footerText: { color: '#444', fontSize: 14 },
  footerLink: { color: '#c8f25d', fontSize: 14, fontWeight: '700' },
})
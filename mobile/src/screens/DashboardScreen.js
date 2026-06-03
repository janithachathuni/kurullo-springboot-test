// src/screens/DashboardScreen.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme()
  const s = styles(theme)

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Dashboard 🎉</Text>
        <TouchableOpacity style={s.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Text style={s.settingsText}>⚙</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    title: { color: theme.text, fontSize: 20, fontWeight: '700' },
    settingsBtn: {
      backgroundColor: theme.bgSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 8,
    },
    settingsText: { fontSize: 18 },
  })
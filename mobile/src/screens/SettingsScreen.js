// src/screens/SettingsScreen.js
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
} from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { Heading, BodyText } from '../components/Typography'

export default function SettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme()
  const s = styles(theme)

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Heading style={s.title}>Settings</Heading>
        <View style={s.titleAccent} />
      </View>

      {/* Theme row */}
      <View style={s.section}>
        <BodyText style={s.sectionLabel}>APPEARANCE</BodyText>
        <View style={s.row}>
          <View>
            <BodyText style={s.rowTitle}>{isDark ? 'Dark Mode' : 'Light Mode'}</BodyText>
            <BodyText style={s.rowSub}>
              {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            </BodyText>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor={isDark ? theme.accentText : '#ffffff'}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.bg },
    header: {
      paddingHorizontal: 28,
      paddingTop: 32,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backBtn: { marginBottom: 16 },
    backText: { color: theme.accent, fontSize: 14, fontWeight: '600' },
    title: {
      color: theme.text,
      fontSize: 36,
      fontWeight: '800',
      letterSpacing: -1,
    },
    titleAccent: {
      width: 40,
      height: 3,
      backgroundColor: theme.accent,
      marginTop: 10,
      borderRadius: 2,
    },
    section: { paddingHorizontal: 28, paddingTop: 32 },
    sectionLabel: {
      color: theme.textMuted,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 2,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.bgSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 18,
      paddingVertical: 16,
    },
    rowTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '600',
      marginBottom: 2,
    },
    rowSub: { color: theme.textMuted, fontSize: 12 },
  })
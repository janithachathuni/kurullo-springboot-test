// src/screens/ColourScreen.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useTheme, fonts } from '../context/ThemeContext'

const darkPalette = [
  { name: 'Background', hex: '#0f0f0f' },
  { name: 'Surface', hex: '#151c19' },
  { name: 'Card', hex: '#0b0b0b' },
  { name: 'Border', hex: '#2e2e2e' },
  { name: 'Accent', hex: '#8fc6a3' },
  { name: 'Accent Light', hex: '#b4daae' },
  { name: 'Text Primary', hex: '#bed0be' },
  { name: 'Text Secondary', hex: '#9ca3af' },
]

const lightPalette = [
  { name: 'Background', hex: '#ffffff' },
  { name: 'Surface', hex: '#f0f5f2' },
  { name: 'Card', hex: '#ffffff' },
  { name: 'Border', hex: 'rgba(209, 213, 219, 0.7)' },
  { name: 'Accent', hex: '#143829' },
  { name: 'Accent Light', hex: '#1a4a35' },
  { name: 'Text Primary', hex: '#111111' },
  { name: 'Text Secondary', hex: '#4b5563' },
]

function ColourSwatch({ colour }) {
  const { theme } = useTheme()
  const isLight = colour.hex === '#ffffff' || colour.hex === '#f0f5f2' || colour.hex === '#ffffff' || colour.hex === 'rgba(209, 213, 219, 0.7)'
  const isDark = theme.dark
  
  // Determine text color based on background
  let textColor = isLight ? '#111111' : '#f0f0f0'
  // Special handling for accent colors
  if (colour.hex === '#143829' || colour.hex === '#1a4a35') {
    textColor = '#ffffff'
  }
  if (colour.hex === '#8fc6a3' || colour.hex === '#b4daae') {
    textColor = '#0f0f0f'
  }
  
  return (
    <View style={[styles.swatch, { backgroundColor: colour.hex }]}>
      <Text style={[styles.swatchName, { color: textColor }]}>{colour.name}</Text>
      <Text style={[styles.swatchHex, { color: textColor, opacity: 0.7 }]}>{colour.hex}</Text>
    </View>
  )
}

export default function ColourScreen({ navigation }) {
  const { theme } = useTheme()
  const s = styles

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Header */}
      <View style={[s.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[s.backText, { color: theme.accent }]}>← Back to Dashboard</Text>
        </TouchableOpacity>
        <Text style={[s.title, { color: theme.text }]}>Colour Palette</Text>
        <View style={[s.titleAccent, { backgroundColor: theme.accent }]} />
      </View>

      <ScrollView contentContainerStyle={[s.body, { backgroundColor: theme.bg }]}>
        {/* Dark Mode Palette */}
        <View style={[s.section, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>🌙 Dark Mode</Text>
          <View style={s.swatchGrid}>
            {darkPalette.map((c, index) => <ColourSwatch key={index} colour={c} />)}
          </View>
        </View>

        {/* Light Mode Palette */}
        <View style={[s.section, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>☀️ Light Mode</Text>
          <View style={s.swatchGrid}>
            {lightPalette.map((c, index) => <ColourSwatch key={index} colour={c} />)}
          </View>
        </View>

        {/* Theme Toggle Info */}
        <View style={[s.infoSection, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
          <Text style={[s.infoTitle, { color: theme.text }]}>💡 Current Theme</Text>
          <Text style={[s.infoText, { color: theme.textSecondary }]}>
            {theme.dark ? 'Dark Mode' : 'Light Mode'} active
          </Text>
          <Text style={[s.infoText, { color: theme.textSecondary, marginTop: 4 }]}>
            Accent: {theme.accent}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backText: {
    fontSize: 14,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
  title: {
    fontSize: 32,
    letterSpacing: -1,
    marginTop: 12,
    fontFamily: 'Besley_700Bold',
  },
  titleAccent: {
    width: 40,
    height: 3,
    marginTop: 8,
    borderRadius: 2,
  },
  body: {
    padding: 24,
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 15,
    marginBottom: 16,
    letterSpacing: 0.5,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  swatchName: {
    fontSize: 10,
    fontFamily: 'SchibstedGrotesk_700Bold',
    letterSpacing: 0.3,
  },
  swatchHex: {
    fontSize: 8,
    marginTop: 2,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
  infoSection: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 15,
    marginBottom: 8,
    fontFamily: 'SchibstedGrotesk_500Medium',
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
})
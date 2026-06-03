// src/screens/ColourScreen.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useTheme } from '../context/ThemeContext'

const darkPalette = [
  { name: 'Background', hex: '#0a0a0a' },
  { name: 'Surface', hex: '#161616' },
  { name: 'Card', hex: '#1e1e1e' },
  { name: 'Border', hex: '#2a2a2a' },
  { name: 'Accent', hex: '#c8f25d' },
  { name: 'Text', hex: '#f0f0f0' },
]

const lightPalette = [
  { name: 'Background', hex: '#ffffff' },
  { name: 'Surface', hex: '#f4f4f4' },
  { name: 'Card', hex: '#ebebeb' },
  { name: 'Border', hex: '#dddddd' },
  { name: 'Accent', hex: '#c8f25d' },
  { name: 'Text', hex: '#0a0a0a' },
]

function ColourSwatch({ colour }) {
  const isLight = colour.hex === '#ffffff' || colour.hex === '#f4f4f4' || colour.hex === '#ebebeb' || colour.hex === '#dddddd'
  return (
    <View style={[styles.swatch, { backgroundColor: colour.hex }]}>
      <Text style={[styles.swatchName, { color: isLight ? '#0a0a0a' : '#f0f0f0' }]}>{colour.name}</Text>
      <Text style={[styles.swatchHex, { color: isLight ? '#555' : '#aaa' }]}>{colour.hex}</Text>
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
        <Text style={[s.title, { color: theme.text }]}>Colour Screen</Text>
        <View style={[s.titleAccent, { backgroundColor: theme.accent }]} />
      </View>

      <ScrollView contentContainerStyle={[s.body, { backgroundColor: theme.bg }]}>
        {/* Dark Mode Palette */}
        <View style={[s.section, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>🌙 Dark Mode</Text>
          <View style={s.swatchGrid}>
            {darkPalette.map((c) => <ColourSwatch key={c.name + 'dark'} colour={c} />)}
          </View>
        </View>

        {/* Light Mode Palette */}
        <View style={[s.section, { backgroundColor: theme.bgSecondary, borderColor: theme.border }]}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>☀️ Light Mode</Text>
          <View style={s.swatchGrid}>
            {lightPalette.map((c) => <ColourSwatch key={c.name + 'light'} colour={c} />)}
          </View>
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
  },
  swatchName: {
    fontSize: 10,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  swatchHex: {
    fontSize: 9,
    marginTop: 2,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
})
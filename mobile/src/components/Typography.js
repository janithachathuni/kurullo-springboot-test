// src/components/Typography.js
import React from 'react'
import { Text } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export function BodyText({ style, ...props }) {
  const { theme, fonts } = useTheme()
  return <Text style={[{ fontFamily: fonts.body, color: theme.text }, style]} {...props} />
}

export function BoldText({ style, ...props }) {
  const { theme, fonts } = useTheme()
  return <Text style={[{ fontFamily: fonts.bodyBold, color: theme.text }, style]} {...props} />
}

export function Heading({ style, ...props }) {
  const { theme, fonts } = useTheme()
  return <Text style={[{ fontFamily: fonts.headingBold, color: theme.text }, style]} {...props} />
}

export function MediumText({ style, ...props }) {
  const { theme, fonts } = useTheme()
  return <Text style={[{ fontFamily: 'SchibstedGrotesk_500Medium', color: theme.text }, style]} {...props} />
}
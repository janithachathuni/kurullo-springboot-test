import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const backgroundimg = require('../../assets/backgroundimg.jpg');
const backgroundimg2 = require('../../assets/backgroundimg2.jpg');
const backgroundimg3 = require('../../assets/backgroundimg3.jpg');
const backgroundimg4 = require('../../assets/backgroundimg4.jpg');
const birdlogo = require('../../assets/birdlogo.png');

const { width } = Dimensions.get('window');

// Same top/left/rotation/zIndex values as the web version
const heroImages = [
  { src: backgroundimg, rotation: '-12deg', zIndex: 4, top: '5%', left: '10%' },
  { src: backgroundimg2, rotation: '8deg', zIndex: 3, top: '25%', left: '25%' },
  { src: backgroundimg3, rotation: '-5deg', zIndex: 2, top: '10%', left: '45%' },
  { src: backgroundimg4, rotation: '15deg', zIndex: 1, top: '30%', left: '15%' },
];

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { theme, fonts } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.heroContainer}>
        {heroImages.map((image, index) => (
          <View
            key={index}
            style={[
              styles.imageWrapper,
              {
                top: image.top,
                left: image.left,
                transform: [{ rotate: image.rotation }],
                zIndex: image.zIndex,
                borderColor: theme.border,
              },
            ]}
          >
            <Image source={image.src} style={styles.heroImage} resizeMode="cover" />
          </View>
        ))}
      </View>

      <View style={[styles.overlay, { backgroundColor: 'rgba(255,255,255,0.85)' }]}>
        <View style={styles.content}>
  <View style={styles.titleRow}>
    <Text style={[styles.title, { color: theme.text, fontFamily: fonts.headingBold }]}>
      Kurullo
    </Text>
    <Image source={birdlogo} style={styles.logo} resizeMode="contain" />
  </View>
  <Text style={[styles.tagline, { color: theme.textSecondary, fontFamily: fonts.body }]}>
    Discover, log, and share the birds around you
  </Text>
</View>

        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.button, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.primaryButtonText, { color: theme.accentText, fontFamily: fonts.bodyBold }]}>
              Log In
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton, { borderColor: theme.accent }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.accent, fontFamily: fonts.bodyBold }]}>
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  titleRow: {
  flexDirection: 'row',
  alignItems: 'flex-start', // keeps logo pinned toward the top of the row, not vertically centered
  justifyContent: 'center',
},
logo: {
  width: 32,
  height: 32,
  marginLeft: -9,
  marginTop: -4, // nudges it upward relative to the text baseline, like the web version's -mt/-ml offsets
},

  imageWrapper: {
    position: 'absolute',
    width: width * 0.5,          // scaled down from web's 350px for mobile screens
    height: width * 0.5 * (250 / 350), // preserves the 350:250 (7:5) aspect ratio
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 230 },
  title: { fontSize: 44, marginBottom: 12 },
  tagline: { fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  buttonGroup: { gap: 12, marginBottom: 20 },
  button: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { fontSize: 16 },
  secondaryButton: { borderWidth: 1.5, backgroundColor: 'transparent' },
  secondaryButtonText: { fontSize: 16 },
});
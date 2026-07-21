// src/screens/DashboardScreen.js
import React from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert 
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTheme } from '../context/ThemeContext'

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme()
  const s = styles(theme)

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear auth data
              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('role');
              
              // Navigate back to Auth stack (not Login directly)
              // This resets to the Auth navigator which shows Login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }] // 👈 Use 'Auth' since it's the navigator name
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Dashboard</Text>
        <View style={s.headerRight}>
          <TouchableOpacity 
            style={s.iconBtn} 
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={s.iconText}>⚙</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={s.iconBtn} 
            onPress={handleLogout}
          >
            <Text style={s.iconText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.body}>
        <TouchableOpacity style={s.link} onPress={() => navigation.navigate('Colour')}>
          <Text style={s.linkText}>Colour Screen →</Text>
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
    title: {
      color: theme.text,
      fontSize: 24,
      fontFamily: 'Besley_700Bold',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    iconBtn: {
      backgroundColor: theme.bgSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 8,
    },
    iconText: {
      fontSize: 18,
    },
    body: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 32,
    },
    link: {
      backgroundColor: theme.bgSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 18,
      paddingVertical: 16,
    },
    linkText: {
      color: theme.accent,
      fontSize: 15,
      fontFamily: 'SchibstedGrotesk_700Bold',
    },
  })
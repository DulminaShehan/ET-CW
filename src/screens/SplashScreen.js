import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import FireGuardLogo from '../components/FireGuardLogo';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9E4" />
      <FireGuardLogo size={130} />
      <Text style={styles.title}>FIREGUARD</Text>
      <Text style={styles.subtitle}>Smart Forest Fire Detection System</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9E4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#F4A7A7',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#1a1a1a',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#E05252',
    marginTop: 8,
    fontWeight: '500',
  },
});

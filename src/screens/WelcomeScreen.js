import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import FireGuardLogo from '../components/FireGuardLogo';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9E4" />
      <FireGuardLogo size={130} />
      <Text style={styles.description}>
        FireGuard helps you{'\n'}Identify forest fire detection{'\n'}instantly
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 32,
  },
  description: {
    fontSize: 18,
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 48,
    lineHeight: 28,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2D4F7C',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

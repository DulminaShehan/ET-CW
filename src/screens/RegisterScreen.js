import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FireGuardLogo from '../components/FireGuardLogo';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('hiker');

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar barStyle="dark-content" backgroundColor="#FAF9E4" />

        <FireGuardLogo size={90} />
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Join the fire watch network 🌿</Text>

        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#aaa"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="••••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>YOUR ROLE</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleCard, role === 'hiker' && styles.roleCardActive]}
            onPress={() => setRole('hiker')}
          >
            <Ionicons name="walk" size={28} color={role === 'hiker' ? '#2D4F7C' : '#555'} />
            <Text style={[styles.roleLabel, role === 'hiker' && styles.roleLabelActive]}>Hiker</Text>
            <Text style={styles.roleDesc}>weather & fire alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, role === 'officer' && styles.roleCardActive]}
            onPress={() => setRole('officer')}
          >
            <Ionicons name="business" size={28} color={role === 'officer' ? '#2D4F7C' : '#555'} />
            <Text style={[styles.roleLabel, role === 'officer' && styles.roleLabelActive]}>GOV. officer</Text>
            <Text style={styles.roleDesc}>Full system access</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Dashboard', { role })}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#FAF9E4',
    borderWidth: 8,
    borderColor: '#F4A7A7',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    marginBottom: 24,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  roleCardActive: {
    borderColor: '#2D4F7C',
    backgroundColor: '#EEF3FA',
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    marginTop: 6,
  },
  roleLabelActive: {
    color: '#2D4F7C',
  },
  roleDesc: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#2D4F7C',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#555',
  },
  footerLink: {
    fontSize: 13,
    color: '#2D4F7C',
    fontWeight: '700',
  },
});

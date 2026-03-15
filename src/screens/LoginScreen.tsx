import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Image } from 'react-native';
import { useStore } from '../store/useStore';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useStore(state => state.login);

  const handleLogin = () => {
    if (email) {
      login(email);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Sales AI</Text>
          <Text style={styles.subtitle}>Professional Visit Logging & Analytics</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>@</Text>
            <TextInput 
              style={styles.input} 
              placeholder="name@company.com" 
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.passwordHeader}>
             <Text style={styles.label}>PASSWORD</Text>
             <Text style={styles.forgotText}>Forgot?</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox} />
            <Text style={styles.checkboxLabel}>Stay logged in</Text>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerLink}>Contact Admin</Text></Text>
          <View style={styles.legalLinks}>
             <Text style={styles.legalText}>PRIVACY</Text>
             <Text style={styles.legalDot}>•</Text>
             <Text style={styles.legalText}>TERMS</Text>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  iconContainer: { marginBottom: 16 },
  logoImage: { width: 80, height: 80, borderRadius: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#4b5563' },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 40 },
  label: { fontSize: 12, fontWeight: '600', color: '#111827', marginBottom: 8, letterSpacing: 0.5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 12, paddingHorizontal: 16, marginBottom: 20, height: 50 },
  inputIcon: { fontSize: 16, marginRight: 12, color: '#9ca3af' },
  input: { flex: 1, fontSize: 15, color: '#111827' },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { fontSize: 12, color: '#2563eb', fontWeight: '500', marginBottom: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#d1d5db', marginRight: 10 },
  checkboxLabel: { fontSize: 14, color: '#4b5563' },
  loginButton: { backgroundColor: '#2563eb', borderRadius: 12, height: 50, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  loginButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  footerLink: { color: '#2563eb', fontWeight: '600' },
  legalLinks: { flexDirection: 'row', alignItems: 'center' },
  legalText: { fontSize: 12, color: '#9ca3af', fontWeight: '600', letterSpacing: 1 },
  legalDot: { fontSize: 12, color: '#cbd5e1', marginHorizontal: 16 },
});

export default LoginScreen;

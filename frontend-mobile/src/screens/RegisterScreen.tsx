/**
 * RegisterScreen - Client registration screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors, Typography } from '../constants/theme';
import api from '../lib/api';

interface RegisterScreenProps {
  navigation: any;
  onRegisterSuccess: () => void;
  inviteToken?: string;
}

export default function RegisterScreen({
  navigation,
  onRegisterSuccess,
  inviteToken,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await api.registerClient({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        invite_token: inviteToken,
      });

      if (response.success) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente', [
          {
            text: 'OK',
            onPress: onRegisterSuccess,
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Error al crear cuenta');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>💪</Text>
            <Text style={styles.title}>FitCompass Pro</Text>
            <Text style={styles.subtitle}>Crea tu cuenta</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan Pérez"
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <Text style={styles.hint}>Mínimo 6 caracteres</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textTertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.bgPrimary} />
              ) : (
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Inicia sesión aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: 'rgba(55, 50, 47, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  hint: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.amber,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.bgPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  link: {
    fontSize: Typography.sm,
    color: Colors.amber,
    fontWeight: Typography.semibold,
  },
});

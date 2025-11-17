import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla: Inicio</Text>
      <Text style={styles.subtitle}>Feature en desarrollo - F-007</Text>
      <Text style={styles.description}>
        Esta será la pantalla principal donde el cliente verá su resumen de actividad,
        próximos entrenamientos y estadísticas destacadas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing[3],
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
  },
  description: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.sm,
  },
});

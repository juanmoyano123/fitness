/**
 * WorkoutCompleteModal Component - F-009
 * Congratulations modal shown when workout is completed
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface WorkoutCompleteModalProps {
  visible: boolean;
  workoutName: string;
  duration: number; // minutes
  totalSets: number;
  completedSets: number;
  onClose: () => void;
}

export default function WorkoutCompleteModal({
  visible,
  workoutName,
  duration,
  totalSets,
  completedSets,
  onClose,
}: WorkoutCompleteModalProps) {
  const completionRate = Math.round((completedSets / totalSets) * 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Celebration Icon */}
          <Text style={styles.celebrationIcon}>🎉</Text>

          {/* Title */}
          <Text style={styles.title}>¡Felicitaciones!</Text>
          <Text style={styles.subtitle}>Completaste el workout</Text>

          {/* Workout Name */}
          <Text style={styles.workoutName}>{workoutName}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{duration}</Text>
              <Text style={styles.statLabel}>Minutos</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {completedSets}/{totalSets}
              </Text>
              <Text style={styles.statLabel}>Sets completados</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completado</Text>
            </View>
          </View>

          {/* Progress Message */}
          {completionRate === 100 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageIcon}>💪</Text>
              <Text style={styles.messageText}>
                ¡Excelente trabajo! Completaste todos los sets.
              </Text>
            </View>
          ) : (
            <View style={styles.messageBox}>
              <Text style={styles.messageIcon}>👏</Text>
              <Text style={styles.messageText}>
                ¡Buen esfuerzo! Sigue así para alcanzar tus metas.
              </Text>
            </View>
          )}

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Ver Resumen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  container: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: BorderRadius.xl,
    padding: Spacing[8],
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  celebrationIcon: {
    fontSize: 72,
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
  },
  workoutName: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.amber,
    marginBottom: Spacing[6],
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.bgSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[6],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(55, 50, 47, 0.1)',
    marginHorizontal: Spacing[2],
  },
  messageBox: {
    backgroundColor: Colors.bgTertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing[4],
    marginBottom: Spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  messageIcon: {
    fontSize: Typography['2xl'],
  },
  messageText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.sm,
  },
  button: {
    backgroundColor: Colors.green,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[8],
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textWhite,
  },
});

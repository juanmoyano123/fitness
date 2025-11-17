/**
 * RestTimer Component - F-009
 * Modal countdown timer for rest periods between sets
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface RestTimerProps {
  visible: boolean;
  seconds: number;
  onClose: () => void;
}

export default function RestTimer({ visible, seconds, onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (visible) {
      setTimeLeft(seconds);
      setIsPaused(false);
    }
  }, [visible, seconds]);

  useEffect(() => {
    if (!visible || isPaused) return;

    if (timeLeft <= 0) {
      // Trigger haptic feedback when timer completes
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        onClose();
      }, 1000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // Haptic feedback at 3, 2, 1 seconds
        if (prev <= 3 && prev > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, timeLeft, isPaused, onClose]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return (timeLeft / seconds) * 100;
  };

  const handleSkip = () => {
    onClose();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <View style={[styles.progressRing, { borderColor: getProgressColor(timeLeft) }]}>
              <Text style={styles.timerText}>
                {timeLeft > 0 ? formatTime(timeLeft) : '¡Listo!'}
              </Text>
            </View>
          </View>

          {/* Status */}
          <Text style={styles.status}>
            {timeLeft > 0
              ? isPaused
                ? 'Pausado'
                : 'Descansando...'
              : '¡Tiempo completado!'}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${getProgress()}%`,
                  backgroundColor: getProgressColor(timeLeft),
                },
              ]}
            />
          </View>

          {/* Buttons */}
          {timeLeft > 0 && (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handlePause}
              >
                <Text style={styles.buttonTextSecondary}>
                  {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSkip}
              >
                <Text style={styles.buttonTextPrimary}>Saltar Descanso</Text>
              </TouchableOpacity>
            </View>
          )}

          {timeLeft <= 0 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, styles.buttonFull]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextPrimary}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const getProgressColor = (timeLeft: number): string => {
  if (timeLeft <= 10) return Colors.rose;
  if (timeLeft <= 30) return Colors.amber;
  return Colors.green;
};

const { width } = Dimensions.get('window');

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
  timerContainer: {
    marginBottom: Spacing[6],
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
  },
  timerText: {
    fontSize: 56,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  status: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.bgSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing[6],
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing[3],
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFull: {
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: Colors.green,
  },
  buttonSecondary: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: 'rgba(55, 50, 47, 0.2)',
  },
  buttonTextPrimary: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textWhite,
  },
  buttonTextSecondary: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
});

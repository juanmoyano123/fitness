/**
 * ExerciseCard Component - F-009
 * Expandible exercise card with logging functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { WorkoutExerciseDetail, ExerciseLog } from '../types/workout';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface ExerciseCardProps {
  exercise: WorkoutExerciseDetail;
  isExpanded: boolean;
  isWorkoutActive: boolean;
  onToggle: () => void;
  onUpdateLog: (exerciseId: string, logs: ExerciseLog[]) => void;
  onStartRestTimer: (seconds: number) => void;
}

export default function ExerciseCard({
  exercise,
  isExpanded,
  isWorkoutActive,
  onToggle,
  onUpdateLog,
  onStartRestTimer,
}: ExerciseCardProps) {
  const [logs, setLogs] = useState<ExerciseLog[]>(
    exercise.logs.length > 0
      ? exercise.logs
      : Array.from({ length: exercise.targetSets }, (_, i) => ({
          setNumber: i + 1,
          repsCompleted: exercise.targetReps,
          weightUsed: exercise.targetWeight || 0,
          completed: false,
        }))
  );

  const completedSets = logs.filter(log => log.completed).length;
  const allCompleted = completedSets === exercise.targetSets;

  const handleCompleteSet = (setIndex: number) => {
    const newLogs = [...logs];
    newLogs[setIndex] = {
      ...newLogs[setIndex],
      completed: true,
      timestamp: new Date(),
    };
    setLogs(newLogs);
    onUpdateLog(exercise.id, newLogs);

    // Auto-start rest timer after completing a set (except last set)
    if (setIndex < exercise.targetSets - 1) {
      onStartRestTimer(exercise.restSeconds);
    }
  };

  const handleUpdateReps = (setIndex: number, value: string) => {
    const newLogs = [...logs];
    newLogs[setIndex].repsCompleted = parseInt(value) || 0;
    setLogs(newLogs);
  };

  const handleUpdateWeight = (setIndex: number, value: string) => {
    const newLogs = [...logs];
    newLogs[setIndex].weightUsed = parseFloat(value) || 0;
    setLogs(newLogs);
  };

  return (
    <View style={styles.card}>
      {/* Header - Always Visible */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {allCompleted && (
            <Text style={styles.completedCheck}>✓</Text>
          )}
          <View>
            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
            <Text style={styles.targetInfo}>
              {exercise.targetSets} sets × {exercise.targetReps} reps
              {exercise.targetWeight && ` @ ${exercise.targetWeight}kg`}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {!isExpanded && (
            <Text style={styles.progress}>
              {completedSets}/{exercise.targetSets}
            </Text>
          )}
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* GIF Demo */}
          <Image
            source={{ uri: exercise.gifUrl }}
            style={styles.gif}
            resizeMode="cover"
          />

          {/* Target Info */}
          <View style={styles.targetBox}>
            <Text style={styles.targetLabel}>Target:</Text>
            <Text style={styles.targetValue}>
              {exercise.targetSets} sets × {exercise.targetReps} reps
              {exercise.targetWeight && ` @ ${exercise.targetWeight}kg`}
            </Text>
            <Text style={styles.restInfo}>
              Rest: {exercise.restSeconds}s
            </Text>
          </View>

          {/* Sets Logging */}
          {isWorkoutActive && (
            <View style={styles.setsContainer}>
              <Text style={styles.setsTitle}>Log your sets:</Text>
              {logs.map((log, index) => (
                <View
                  key={index}
                  style={[
                    styles.setRow,
                    log.completed && styles.setRowCompleted,
                  ]}
                >
                  <View style={styles.setNumber}>
                    <Text style={styles.setNumberText}>{log.setNumber}</Text>
                  </View>

                  <View style={styles.setInputs}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Reps</Text>
                      <TextInput
                        style={[
                          styles.input,
                          log.completed && styles.inputDisabled,
                        ]}
                        value={log.repsCompleted.toString()}
                        onChangeText={(value) => handleUpdateReps(index, value)}
                        keyboardType="number-pad"
                        editable={!log.completed}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Peso (kg)</Text>
                      <TextInput
                        style={[
                          styles.input,
                          log.completed && styles.inputDisabled,
                        ]}
                        value={log.weightUsed.toString()}
                        onChangeText={(value) => handleUpdateWeight(index, value)}
                        keyboardType="decimal-pad"
                        editable={!log.completed}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.completeButton,
                      log.completed && styles.completeButtonCompleted,
                    ]}
                    onPress={() => handleCompleteSet(index)}
                    disabled={log.completed}
                  >
                    <Text style={styles.completeButtonText}>
                      {log.completed ? '✓' : '✓'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Rest Timer Button */}
          {isWorkoutActive && (
            <TouchableOpacity
              style={styles.restTimerButton}
              onPress={() => onStartRestTimer(exercise.restSeconds)}
            >
              <Text style={styles.restTimerIcon}>⏱️</Text>
              <Text style={styles.restTimerText}>
                Start Rest Timer ({exercise.restSeconds}s)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing[3],
  },
  completedCheck: {
    fontSize: Typography.xl,
    color: Colors.green,
  },
  exerciseName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  targetInfo: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    marginTop: Spacing[1],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  progress: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.amber,
  },
  expandIcon: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  expandedContent: {
    padding: Spacing[4],
    paddingTop: 0,
  },
  gif: {
    width: '100%',
    height: 225,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing[4],
    backgroundColor: Colors.bgSecondary,
  },
  targetBox: {
    backgroundColor: Colors.bgSecondary,
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    marginBottom: Spacing[4],
  },
  targetLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing[1],
  },
  targetValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  restInfo: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
    marginTop: Spacing[1],
  },
  setsContainer: {
    marginBottom: Spacing[4],
  },
  setsTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: Spacing[3],
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
    padding: Spacing[2],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.bgSecondary,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing[2],
  },
  setNumberText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textWhite,
  },
  setInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing[2],
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing[1],
  },
  input: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: BorderRadius.sm,
    padding: Spacing[2],
    fontSize: Typography.base,
    color: Colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(55, 50, 47, 0.1)',
  },
  inputDisabled: {
    backgroundColor: Colors.bgLight,
    color: Colors.textLight,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing[2],
  },
  completeButtonCompleted: {
    backgroundColor: Colors.completed,
  },
  completeButtonText: {
    fontSize: Typography.lg,
    color: Colors.textWhite,
  },
  restTimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sky,
    padding: Spacing[3],
    borderRadius: BorderRadius.md,
    gap: Spacing[2],
  },
  restTimerIcon: {
    fontSize: Typography.lg,
  },
  restTimerText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textWhite,
  },
});

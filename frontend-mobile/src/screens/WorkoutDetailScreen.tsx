/**
 * WorkoutDetailScreen - F-009
 * Detalle del workout con logging de ejercicios
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WorkoutDetail, ExerciseLog } from '../types/workout';
import { getWorkoutDetailById } from '../lib/mock-workout-detail';
import ExerciseCard from '../components/ExerciseCard';
import RestTimer from '../components/RestTimer';
import WorkoutCompleteModal from '../components/WorkoutCompleteModal';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WorkoutDetailScreen() {
  const route = useRoute<WorkoutDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { workoutId } = route.params;

  const [workout, setWorkout] = useState<WorkoutDetail>(
    getWorkoutDetailById(workoutId)
  );
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Update header title
  useEffect(() => {
    navigation.setOptions({
      title: workout.name,
    });
  }, [navigation, workout.name]);

  // Timer for elapsed time
  useEffect(() => {
    if (!isWorkoutActive || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60);
      setElapsedMinutes(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutActive, startTime]);

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setStartTime(new Date());
    setWorkout(prev => ({ ...prev, status: 'in_progress', startedAt: new Date() }));

    // Auto-expand first exercise
    if (workout.exercises.length > 0) {
      setExpandedExerciseId(workout.exercises[0].id);
    }
  };

  const handleFinishWorkout = () => {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
    const completedSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.logs.filter(log => log.completed).length,
      0
    );

    setWorkout(prev => ({
      ...prev,
      status: 'completed',
      completedAt: new Date(),
      duration: elapsedMinutes,
    }));

    setShowCompleteModal(true);
  };

  const handleToggleExercise = (exerciseId: string) => {
    setExpandedExerciseId(prev => prev === exerciseId ? null : exerciseId);
  };

  const handleUpdateLog = (exerciseId: string, logs: ExerciseLog[]) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, logs } : ex
      ),
    }));

    // Auto-expand next exercise if current one is completed
    const currentExerciseIndex = workout.exercises.findIndex(ex => ex.id === exerciseId);
    const currentExercise = workout.exercises[currentExerciseIndex];
    const allSetsCompleted = logs.every(log => log.completed);

    if (allSetsCompleted && currentExerciseIndex < workout.exercises.length - 1) {
      const nextExercise = workout.exercises[currentExerciseIndex + 1];
      setTimeout(() => {
        setExpandedExerciseId(nextExercise.id);
      }, 500);
    }
  };

  const handleStartRestTimer = (seconds: number) => {
    setRestSeconds(seconds);
    setShowRestTimer(true);
  };

  const handleBackPress = () => {
    if (isWorkoutActive) {
      Alert.alert(
        'Salir sin finalizar?',
        'Tu progreso se guardará y podrás continuar más tarde.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Sí, salir',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false);
    navigation.goBack();
  };

  // Override back button behavior
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isWorkoutActive]);

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
  const completedSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.logs.filter(log => log.completed).length,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        {isWorkoutActive && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Tiempo</Text>
              <Text style={styles.statValue}>{elapsedMinutes} min</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets</Text>
              <Text style={styles.statValue}>
                {completedSets}/{totalSets}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ejercicios</Text>
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
            </View>
          </View>
        )}

        {/* Start/Finish Button */}
        {!isWorkoutActive ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Text style={styles.startButtonText}>Iniciar Entrenamiento</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishWorkout}
          >
            <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Exercises List */}
      <ScrollView
        style={styles.exercisesList}
        contentContainerStyle={styles.exercisesContent}
      >
        <Text style={styles.sectionTitle}>Ejercicios ({workout.exercises.length})</Text>
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isExpanded={expandedExerciseId === exercise.id}
            isWorkoutActive={isWorkoutActive}
            onToggle={() => handleToggleExercise(exercise.id)}
            onUpdateLog={handleUpdateLog}
            onStartRestTimer={handleStartRestTimer}
          />
        ))}
      </ScrollView>

      {/* Rest Timer Modal */}
      <RestTimer
        visible={showRestTimer}
        seconds={restSeconds}
        onClose={() => setShowRestTimer(false)}
      />

      {/* Workout Complete Modal */}
      <WorkoutCompleteModal
        visible={showCompleteModal}
        workoutName={workout.name}
        duration={elapsedMinutes}
        totalSets={totalSets}
        completedSets={completedSets}
        onClose={handleCloseCompleteModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
  },
  header: {
    backgroundColor: Colors.bgPrimary,
    padding: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 50, 47, 0.08)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing[4],
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing[1],
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  startButton: {
    backgroundColor: Colors.amber,
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textWhite,
  },
  finishButton: {
    backgroundColor: Colors.green,
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textWhite,
  },
  exercisesList: {
    flex: 1,
  },
  exercisesContent: {
    padding: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: Spacing[4],
  },
  backButton: {
    fontSize: Typography.base,
    color: Colors.primary,
    paddingLeft: Spacing[4],
  },
});

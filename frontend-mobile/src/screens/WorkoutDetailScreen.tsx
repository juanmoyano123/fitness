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
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WorkoutDetail, ExerciseLog, WorkoutExerciseDetail } from '../types/workout';
import {
  getAssignmentDetail,
  startWorkout as apiStartWorkout,
  logSet as apiLogSet,
  completeWorkout as apiCompleteWorkout,
  AssignmentDetail,
  AssignmentExercise,
} from '../lib/api';
import ExerciseCard from '../components/ExerciseCard';
import RestTimer from '../components/RestTimer';
import WorkoutCompleteModal from '../components/WorkoutCompleteModal';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Convert API exercise to UI exercise
function mapApiExerciseToUi(apiExercise: AssignmentExercise): WorkoutExerciseDetail {
  return {
    id: apiExercise.id,
    exerciseId: apiExercise.exerciseId,
    exerciseName: apiExercise.name,
    gifUrl: apiExercise.gifUrl,
    targetSets: apiExercise.sets,
    targetReps: parseInt(apiExercise.reps) || 10,
    targetWeight: undefined,
    restSeconds: apiExercise.restSeconds,
    logs: apiExercise.logs.map(log => ({
      setNumber: log.setNumber,
      repsCompleted: log.repsCompleted || 0,
      weightUsed: log.weightUsed || 0,
      completed: true,
      timestamp: new Date(log.loggedAt),
    })),
  };
}

export default function WorkoutDetailScreen() {
  const route = useRoute<WorkoutDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { assignmentId } = route.params;

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Load assignment details from API
  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true);
        setError(null);
        const assignmentDetail = await getAssignmentDetail(assignmentId);

        // Map API data to UI data
        const mappedWorkout: WorkoutDetail = {
          id: assignmentDetail.id,
          name: assignmentDetail.workoutName,
          assignedDate: assignmentDetail.assignedDate,
          status: assignmentDetail.status === 'skipped' ? 'completed' : assignmentDetail.status as any,
          exercises: assignmentDetail.exercises.map(mapApiExerciseToUi),
          startedAt: assignmentDetail.startedAt ? new Date(assignmentDetail.startedAt) : undefined,
          completedAt: assignmentDetail.completedAt ? new Date(assignmentDetail.completedAt) : undefined,
          duration: undefined,
        };

        setWorkout(mappedWorkout);

        // Set workout active if already started
        if (mappedWorkout.status === 'in_progress') {
          setIsWorkoutActive(true);
          setStartTime(mappedWorkout.startedAt || new Date());
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar workout';
        setError(errorMessage);
        console.error('Error loading assignment:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  // Update header title
  useEffect(() => {
    if (workout) {
      navigation.setOptions({
        title: workout.name,
      });
    }
  }, [navigation, workout]);

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

  const handleStartWorkout = async () => {
    if (!workout) return;

    try {
      // Call API to start workout
      await apiStartWorkout(assignmentId);

      const now = new Date();
      setIsWorkoutActive(true);
      setStartTime(now);
      setWorkout(prev => prev ? { ...prev, status: 'in_progress', startedAt: now } : null);

      // Auto-expand first exercise
      if (workout.exercises.length > 0) {
        setExpandedExerciseId(workout.exercises[0].id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar workout';
      Alert.alert('Error', errorMessage);
      console.error('Error starting workout:', err);
    }
  };

  const handleFinishWorkout = async () => {
    if (!workout) return;

    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.targetSets, 0);
    const completedSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.logs.filter(log => log.completed).length,
      0
    );

    try {
      // Call API to complete workout
      await apiCompleteWorkout(assignmentId);

      setWorkout(prev => prev ? {
        ...prev,
        status: 'completed',
        completedAt: new Date(),
        duration: elapsedMinutes,
      } : null);

      setShowCompleteModal(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar workout';
      Alert.alert('Error', errorMessage);
      console.error('Error completing workout:', err);
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    setExpandedExerciseId(prev => prev === exerciseId ? null : exerciseId);
  };

  const handleUpdateLog = async (exerciseId: string, logs: ExerciseLog[]) => {
    if (!workout) return;

    // Find the newly completed log (the one that was just marked as completed)
    const currentExercise = workout.exercises.find(ex => ex.id === exerciseId);
    if (!currentExercise) return;

    const newlyCompletedLog = logs.find((log, index) => {
      const oldLog = currentExercise.logs[index];
      return log.completed && (!oldLog || !oldLog.completed);
    });

    // If a set was just completed, log it to the API
    if (newlyCompletedLog) {
      try {
        await apiLogSet(assignmentId, {
          workoutExerciseId: exerciseId,
          setNumber: newlyCompletedLog.setNumber,
          repsCompleted: newlyCompletedLog.repsCompleted,
          weightUsed: newlyCompletedLog.weightUsed,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al guardar set';
        Alert.alert('Error', errorMessage);
        console.error('Error logging set:', err);
        return; // Don't update UI if API call failed
      }
    }

    // Update local state
    setWorkout(prev => prev ? {
      ...prev,
      exercises: prev.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, logs } : ex
      ),
    } : null);

    // Auto-expand next exercise if current one is completed
    const currentExerciseIndex = workout.exercises.findIndex(ex => ex.id === exerciseId);
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

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
        <Text style={styles.loadingText}>Cargando workout...</Text>
      </View>
    );
  }

  // Show error state
  if (error || !workout) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Error al cargar workout</Text>
        <Text style={styles.errorMessage}>{error || 'Workout no encontrado'}</Text>
        <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: Spacing[6],
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing[4],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: Spacing[6],
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing[4],
  },
  errorTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  errorMessage: {
    fontSize: Typography.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing[4],
    lineHeight: Typography.lineHeight.relaxed * Typography.base,
  },
  backButtonContainer: {
    backgroundColor: Colors.amber,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textWhite,
  },
});

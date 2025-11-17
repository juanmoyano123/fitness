import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isToday, isThisWeek, parseISO } from 'date-fns';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchMyWorkouts, WorkoutAssignment } from '../lib/api';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutAssignment[]>([]);

  // Load workouts from API
  const loadWorkouts = useCallback(async () => {
    try {
      setError(null);
      const apiWorkouts = await fetchMyWorkouts();
      setWorkouts(apiWorkouts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(errorMessage);
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load workouts on mount
  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Reload workouts when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  // Calculate stats
  const todayWorkouts = workouts.filter(w => {
    try {
      return isToday(parseISO(w.assignedDate));
    } catch {
      return false;
    }
  });

  const completedThisWeek = workouts.filter(w => {
    try {
      return w.status === 'completed' && w.completedAt && isThisWeek(new Date(w.completedAt));
    } catch {
      return false;
    }
  });

  const upcomingWorkouts = workouts.filter(w => w.status === 'pending').slice(0, 3);

  const handleWorkoutPress = (workout: WorkoutAssignment) => {
    navigation.navigate('WorkoutDetail', { assignmentId: workout.id });
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.amber} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.errorContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.amber}
            colors={[Colors.amber]}
          />
        }
      >
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Error al cargar datos</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWorkouts}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.amber}
          colors={[Colors.amber]}
        />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Bienvenido</Text>
        <Text style={styles.welcomeSubtitle}>
          {todayWorkouts.length > 0
            ? `Tienes ${todayWorkouts.length} workout${todayWorkouts.length > 1 ? 's' : ''} para hoy`
            : 'No tienes workouts para hoy'}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📅</Text>
          <Text style={styles.statValue}>{todayWorkouts.length}</Text>
          <Text style={styles.statLabel}>Hoy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statValue}>{completedThisWeek.length}</Text>
          <Text style={styles.statLabel}>Esta Semana</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💪</Text>
          <Text style={styles.statValue}>
            {workouts.filter(w => w.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>

      {/* Today's Workouts */}
      {todayWorkouts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workouts de Hoy</Text>
          {todayWorkouts.map(workout => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => handleWorkoutPress(workout)}
              activeOpacity={0.7}
            >
              <View style={styles.workoutCardContent}>
                <Text style={styles.workoutName}>{workout.workoutName}</Text>
                <View style={styles.workoutMeta}>
                  <Text style={styles.workoutMetaText}>
                    ⏱️ {workout.durationMinutes || 45} min
                  </Text>
                  <Text style={styles.workoutMetaText}>
                    💪 {workout.exerciseCount} ejercicios
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(workout.status) },
                ]}
              >
                <Text style={styles.statusText}>{getStatusLabel(workout.status)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Upcoming Workouts */}
      {upcomingWorkouts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Workouts</Text>
          {upcomingWorkouts.map(workout => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => handleWorkoutPress(workout)}
              activeOpacity={0.7}
            >
              <View style={styles.workoutCardContent}>
                <Text style={styles.workoutName}>{workout.workoutName}</Text>
                <Text style={styles.workoutDate}>{workout.assignedDate}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('Main', { screen: 'Workouts' } as any)}
          >
            <Text style={styles.viewAllText}>Ver todos los workouts</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty State */}
      {workouts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No tienes workouts asignados</Text>
          <Text style={styles.emptySubtitle}>
            Tu entrenador te asignará workouts pronto. ¡Mantente atento!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: Colors.pending,
    in_progress: Colors.inProgress,
    completed: Colors.completed,
  };
  return colors[status] || Colors.textSecondary;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completado',
  };
  return labels[status] || status;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
  },
  content: {
    padding: Spacing[4],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
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
  retryButton: {
    backgroundColor: Colors.amber,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textWhite,
  },
  welcomeSection: {
    backgroundColor: Colors.bgPrimary,
    padding: Spacing[6],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    ...Shadows.md,
  },
  welcomeTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing[2],
  },
  welcomeSubtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: Spacing[2],
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
  section: {
    marginBottom: Spacing[6],
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: Spacing[3],
  },
  workoutCard: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  workoutCardContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    marginBottom: Spacing[2],
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  workoutMetaText: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  workoutDate: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    marginLeft: Spacing[2],
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textWhite,
  },
  arrow: {
    fontSize: Typography.xl,
    color: Colors.textLight,
    marginLeft: Spacing[2],
  },
  viewAllButton: {
    backgroundColor: Colors.amber,
    padding: Spacing[4],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textWhite,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing[16],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing[4],
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  emptySubtitle: {
    fontSize: Typography.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.base,
    paddingHorizontal: Spacing[6],
  },
});

/**
 * WorkoutsScreen - F-008
 * Lista de workouts asignados con filtros y agrupación
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SectionList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isToday, isTomorrow, parseISO, isThisWeek, isPast } from 'date-fns';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WorkoutStatus } from '../types/workout';
import { fetchMyWorkouts, WorkoutAssignment as ApiWorkoutAssignment } from '../lib/api';
import WorkoutCard from '../components/WorkoutCard';
import FilterTabs from '../components/FilterTabs';
import { Colors, Typography, Spacing } from '../constants/theme';

// Map API assignment to UI workout assignment
interface WorkoutAssignment {
  id: string;
  workoutId: string;
  workoutName: string;
  assignedDate: string;
  status: WorkoutStatus;
  estimatedDuration: number;
  exerciseCount: number;
  thumbnailUrl?: string;
  completedAt?: Date;
}

type FilterOption = 'all' | WorkoutStatus;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WorkoutSection {
  title: string;
  data: WorkoutAssignment[];
}

// Convert API assignment to UI assignment
function mapApiToUiAssignment(apiAssignment: ApiWorkoutAssignment): WorkoutAssignment {
  return {
    id: apiAssignment.id,
    workoutId: apiAssignment.workoutId,
    workoutName: apiAssignment.workoutName,
    assignedDate: apiAssignment.assignedDate,
    status: apiAssignment.status as WorkoutStatus,
    estimatedDuration: apiAssignment.durationMinutes || 45,
    exerciseCount: apiAssignment.exerciseCount,
    thumbnailUrl: undefined,
    completedAt: apiAssignment.completedAt ? new Date(apiAssignment.completedAt) : undefined,
  };
}

export default function WorkoutsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutAssignment[]>([]);

  // Load workouts from API
  const loadWorkouts = useCallback(async () => {
    try {
      setError(null);
      const apiWorkouts = await fetchMyWorkouts();
      const mappedWorkouts = apiWorkouts.map(mapApiToUiAssignment);
      setWorkouts(mappedWorkouts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar workouts';
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

  // Filter workouts based on selected filter
  const filteredWorkouts = useMemo(() => {
    if (selectedFilter === 'all') {
      return workouts;
    }
    return workouts.filter(w => w.status === selectedFilter);
  }, [workouts, selectedFilter]);

  // Group workouts into sections
  const sections: WorkoutSection[] = useMemo(() => {
    const today: WorkoutAssignment[] = [];
    const thisWeek: WorkoutAssignment[] = [];
    const completed: WorkoutAssignment[] = [];
    const upcoming: WorkoutAssignment[] = [];

    filteredWorkouts.forEach(workout => {
      const date = parseISO(workout.assignedDate);

      if (workout.status === 'completed') {
        completed.push(workout);
      } else if (isToday(date)) {
        today.push(workout);
      } else if (isTomorrow(date) || (isThisWeek(date) && !isPast(date))) {
        thisWeek.push(workout);
      } else if (!isPast(date)) {
        upcoming.push(workout);
      }
    });

    const result: WorkoutSection[] = [];
    if (today.length > 0) result.push({ title: 'Hoy', data: today });
    if (thisWeek.length > 0) result.push({ title: 'Esta Semana', data: thisWeek });
    if (upcoming.length > 0) result.push({ title: 'Próximos', data: upcoming });
    if (completed.length > 0) result.push({ title: 'Completados', data: completed });

    return result;
  }, [filteredWorkouts]);

  // Calculate counts for filter tabs
  const filterCounts = useMemo(() => {
    return {
      all: workouts.length,
      pending: workouts.filter(w => w.status === 'pending').length,
      in_progress: workouts.filter(w => w.status === 'in_progress').length,
      completed: workouts.filter(w => w.status === 'completed').length,
    };
  }, [workouts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleWorkoutPress = (workout: WorkoutAssignment) => {
    navigation.navigate('WorkoutDetail', { assignmentId: workout.id });
  };

  const renderSectionHeader = ({ section }: { section: WorkoutSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>
        {section.data.length} {section.data.length === 1 ? 'workout' : 'workouts'}
      </Text>
    </View>
  );

  const renderWorkoutItem = ({ item }: { item: WorkoutAssignment }) => (
    <WorkoutCard
      workout={item}
      onPress={() => handleWorkoutPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>
        {selectedFilter === 'all'
          ? 'Aún no tienes workouts asignados'
          : `No hay workouts ${getFilterLabel(selectedFilter)}`}
      </Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'all'
          ? 'Tu entrenador te asignará workouts pronto. ¡Mantente atento!'
          : 'Prueba con otro filtro para ver más workouts'}
      </Text>
    </View>
  );

  const getFilterLabel = (filter: FilterOption): string => {
    const labels = {
      all: '',
      pending: 'pendientes',
      in_progress: 'en progreso',
      completed: 'completados',
    };
    return labels[filter];
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <FilterTabs
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          counts={filterCounts}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.amber} />
          <Text style={styles.loadingText}>Cargando workouts...</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.container}>
        <FilterTabs
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          counts={filterCounts}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error al cargar workouts</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWorkouts}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterTabs
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        counts={filterCounts}
      />

      {sections.length === 0 ? (
        renderEmptyState()
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.amber}
              colors={[Colors.amber]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
  },
  listContent: {
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.bgSecondary,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  sectionCount: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[16],
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textWhite,
  },
});

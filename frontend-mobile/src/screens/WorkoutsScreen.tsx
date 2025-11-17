/**
 * WorkoutsScreen - F-008
 * Lista de workouts asignados con filtros y agrupación
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SectionList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isToday, isTomorrow, parseISO, isThisWeek, isPast } from 'date-fns';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WorkoutAssignment, WorkoutStatus } from '../types/workout';
import { MOCK_WORKOUT_ASSIGNMENTS } from '../lib/mock-workouts';
import WorkoutCard from '../components/WorkoutCard';
import FilterTabs from '../components/FilterTabs';
import { Colors, Typography, Spacing } from '../constants/theme';

type FilterOption = 'all' | WorkoutStatus;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WorkoutSection {
  title: string;
  data: WorkoutAssignment[];
}

export default function WorkoutsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Filter workouts based on selected filter
  const filteredWorkouts = useMemo(() => {
    if (selectedFilter === 'all') {
      return MOCK_WORKOUT_ASSIGNMENTS;
    }
    return MOCK_WORKOUT_ASSIGNMENTS.filter(w => w.status === selectedFilter);
  }, [selectedFilter]);

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
      all: MOCK_WORKOUT_ASSIGNMENTS.length,
      pending: MOCK_WORKOUT_ASSIGNMENTS.filter(w => w.status === 'pending').length,
      in_progress: MOCK_WORKOUT_ASSIGNMENTS.filter(w => w.status === 'in_progress').length,
      completed: MOCK_WORKOUT_ASSIGNMENTS.filter(w => w.status === 'completed').length,
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleWorkoutPress = (workout: WorkoutAssignment) => {
    navigation.navigate('WorkoutDetail', { workoutId: workout.workoutId });
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
});

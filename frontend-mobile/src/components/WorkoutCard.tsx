/**
 * WorkoutCard Component
 * Displays workout assignment information
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { WorkoutAssignment } from '../types/workout';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface WorkoutCardProps {
  workout: WorkoutAssignment;
  onPress: () => void;
}

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const getStatusBadge = () => {
    const badges = {
      pending: { label: 'Pendiente', color: Colors.pending },
      in_progress: { label: 'En Progreso', color: Colors.inProgress },
      completed: { label: 'Completado ✓', color: Colors.completed },
    };
    return badges[workout.status];
  };

  const getFormattedDate = () => {
    const date = new Date(workout.assignedDate);
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  const badge = getStatusBadge();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Thumbnail */}
        {workout.thumbnailUrl && (
          <Image
            source={{ uri: workout.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}

        {/* Info Section */}
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {workout.workoutName}
            </Text>
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
          </View>

          <Text style={styles.date}>{getFormattedDate()}</Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaText}>~{workout.estimatedDuration} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>💪</Text>
              <Text style={styles.metaText}>{workout.exerciseCount} ejercicios</Text>
            </View>
          </View>

          {workout.completedAt && (
            <Text style={styles.completedTime}>
              Completado: {format(new Date(workout.completedAt), "HH:mm", { locale: es })}
            </Text>
          )}
        </View>

        {/* Arrow */}
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    marginHorizontal: Spacing[4],
    ...Shadows.md,
  },
  content: {
    flexDirection: 'row',
    padding: Spacing[4],
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing[3],
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[1],
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.primary,
    flex: 1,
    marginRight: Spacing[2],
  },
  badge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textWhite,
  },
  date: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
    textTransform: 'capitalize',
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  metaIcon: {
    fontSize: Typography.sm,
  },
  metaText: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  completedTime: {
    fontSize: Typography.xs,
    color: Colors.green,
    marginTop: Spacing[2],
  },
  arrow: {
    fontSize: Typography.xl,
    color: Colors.textLight,
    marginLeft: Spacing[2],
  },
});

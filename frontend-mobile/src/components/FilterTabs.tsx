/**
 * FilterTabs Component
 * Tab navigation for filtering workouts by status
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { WorkoutStatus } from '../types/workout';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

type FilterOption = 'all' | WorkoutStatus;

interface FilterTabsProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  counts: {
    all: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export default function FilterTabs({ selectedFilter, onFilterChange, counts }: FilterTabsProps) {
  const tabs: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'completed', label: 'Completados' },
  ];

  const getCount = (key: FilterOption): number => {
    return counts[key] || 0;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = selectedFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && styles.tabActive,
              ]}
              onPress={() => onFilterChange(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}>
                {tab.label}
              </Text>
              <View style={[
                styles.countBadge,
                isActive && styles.countBadgeActive,
              ]}>
                <Text style={[
                  styles.countText,
                  isActive && styles.countTextActive,
                ]}>
                  {getCount(tab.key)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 50, 47, 0.08)',
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgSecondary,
    gap: Spacing[2],
  },
  tabActive: {
    backgroundColor: Colors.amber,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textWhite,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[1],
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  countTextActive: {
    color: Colors.textWhite,
  },
});

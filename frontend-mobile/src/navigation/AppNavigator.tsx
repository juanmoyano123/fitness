/**
 * Main App Navigation
 * Bottom Tabs + Stack Navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors, Typography } from '../constants/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  WorkoutDetail: { workoutId: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Bottom Tabs Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.amber,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.bgPrimary,
          borderTopColor: 'rgba(55, 50, 47, 0.08)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: Typography.medium,
        },
        headerStyle: {
          backgroundColor: Colors.bgPrimary,
          borderBottomColor: 'rgba(55, 50, 47, 0.08)',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: Typography.lg,
          fontWeight: Typography.semibold,
          color: Colors.primary,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Mis Workouts',
          tabBarLabel: 'Workouts',
          tabBarIcon: ({ color }) => <WorkoutIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Mi Progreso',
          tabBarLabel: 'Progreso',
          tabBarIcon: ({ color }) => <ProgressIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Simple icon components (using emoji for now, can be replaced with icons later)
const HomeIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 24, color }}>🏠</Text>
);

const WorkoutIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 24, color }}>💪</Text>
);

const ProgressIcon = ({ color }: { color: string }) => (
  <Text style={{ fontSize: 24, color }}>📊</Text>
);

// Main Stack Navigator (wraps tabs + detail screens)
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.bgPrimary,
          },
          headerTitleStyle: {
            fontSize: Typography.lg,
            fontWeight: Typography.semibold,
            color: Colors.primary,
          },
          headerTintColor: Colors.primary,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WorkoutDetail"
          component={WorkoutDetailScreen}
          options={{
            title: 'Detalle Workout',
            headerBackTitle: 'Volver',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Need to import Text for icons
import { Text } from 'react-native';

export default AppNavigator;

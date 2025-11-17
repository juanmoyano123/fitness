/**
 * Main App Navigation
 * Auth Stack + Bottom Tabs + Stack Navigation
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors, Typography } from '../constants/theme';
import { View, ActivityIndicator, Text } from 'react-native';
import api from '../lib/api';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProgressScreen from '../screens/ProgressScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  WorkoutDetail: { workoutId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Need to import Text for icons
import { Text } from 'react-native';

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

// Auth Stack Navigator
function AuthNavigator({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  return (
    <AuthStack.Navigator
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
      <AuthStack.Screen
        name="Login"
        options={{ headerShown: false }}
      >
        {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </AuthStack.Screen>
      <AuthStack.Screen
        name="Register"
        options={{ headerShown: false }}
      >
        {(props) => (
          <RegisterScreen {...props} onRegisterSuccess={onLoginSuccess} />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

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

// Main Stack Navigator (wraps auth + tabs + detail screens)
function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await api.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.bgPrimary,
        }}
      >
        <ActivityIndicator size="large" color={Colors.amber} />
        <Text
          style={{
            marginTop: 16,
            fontSize: Typography.base,
            color: Colors.textSecondary,
          }}
        >
          Cargando...
        </Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator onLoginSuccess={handleLoginSuccess} />
      ) : (
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
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;

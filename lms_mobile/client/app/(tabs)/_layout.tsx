import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#EA580C',
      tabBarInactiveTintColor: '#000',
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#fff",
        borderTopWidth: 2,
        borderTopColor: "#EA580C",
        height: Platform.OS === 'ios' ? 65 + insets.bottom : 75,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
      }
    }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({color, focused}) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} /> }} />
      <Tabs.Screen name="Courses" options={{ tabBarIcon: ({color, focused}) => <Ionicons name={focused ? "book" : "book-outline"} size={26} color={color} /> }} />
      <Tabs.Screen name="Assignments" options={{ tabBarIcon: ({color, focused}) => <Ionicons name={focused ? "clipboard" : "clipboard-outline"} size={26} color={color} /> }} />
      <Tabs.Screen name="Downloads" options={{ tabBarIcon: ({color, focused}) => <Ionicons name={focused ? "download" : "download-outline"} size={26} color={color} /> }} />
      <Tabs.Screen name="Profile" options={{ tabBarIcon: ({color, focused}) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} /> }} />
    </Tabs>
  );
}
import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, Download, User, ShieldAlert } from 'lucide-react-native';

import HomeScreen from './src/screens/HomeScreen';
import CourseDetail from './src/screens/CatalogScreen';
import CatalogScreen from './src/screens/CatalogScreen';

const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505' }}>
    <Text style={{ color: '#f97316', fontSize: 18, fontWeight: 'bold' }}>
      {route.name} PAGE COMING SOON
    </Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HOME') return <Home size={size} color={color} />;
          if (route.name === 'COURSES') return <BookOpen size={size} color={color} />;
          if (route.name === 'DOWNLOADS') return <Download size={size} color={color} />;
          if (route.name === 'PROFILE') return <User size={size} color={color} />;
          if (route.name === 'ADMIN') return <ShieldAlert size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { 
          backgroundColor: '#050505', 
          borderTopWidth: 1, 
          borderTopColor: '#1A1A1A',
          height: 85,
          paddingBottom: 25, // Adjusted for better bottom spacing on mobile
          paddingTop: 10
        },
        headerStyle: { backgroundColor: '#050505', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '900', fontSize: 12, letterSpacing: 2 },
      })}
    >
      <Tab.Screen name="HOME" component={HomeScreen} options={{ title: 'DASHBOARD' }} />
      {/* FIXED: Changed from CourseCard to PlaceholderScreen */}
      <Tab.Screen name="COURSES" component={CatalogScreen} options={{ title: 'CATALOG' }} />
      <Tab.Screen name="DOWNLOADS" component={PlaceholderScreen} options={{ title: 'VAULT' }} />
      <Tab.Screen name="PROFILE" component={PlaceholderScreen} options={{ title: 'STUDENT' }} />
      <Tab.Screen name="ADMIN" component={PlaceholderScreen} options={{ title: 'CONTROL' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="DETAILS" 
          component={CourseDetail} 
          options={{ 
            headerShown: true, 
            headerStyle: { backgroundColor: '#050505', borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
            headerTintColor: '#fff',
            title: 'COURSE OVERVIEW',
            headerTitleStyle: { fontSize: 14, fontWeight: 'bold' }
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
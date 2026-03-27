import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Tablayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'black',
        tabBarShowLabel:false,
        headerShown: false, 
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
          backgroundColor:"#fff",
          borderWidth:2,
          borderTopColor:"orange",
          height:85,
          paddingTop:2
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Assignments"
        options={{
          title: 'Assignments',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Downloads"
        options={{
          title: 'Downloads',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'download' : 'download-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
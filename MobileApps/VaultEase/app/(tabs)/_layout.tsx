import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // High contrast colors suited for accessibility (elderly users)
  const activeColor = '#2563eb'; // High contrast Slate Blue (blue-600)
  const inactiveColor = '#475569'; // Slate Gray (slate-600)
  const backgroundColor = '#f8fafc'; // Very light gray (slate-50)
  const borderColor = '#cbd5e1'; // Light gray border (slate-300)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelPosition: 'below-icon',
        headerShown: true,
        headerStyle: {
          backgroundColor: backgroundColor,
          borderBottomWidth: 2,
          borderBottomColor: borderColor,
          height: 100, // Massive header height
        },
        headerTitleStyle: {
          fontSize: 24, // text-2xl
          fontWeight: 'bold',
          color: '#0f172a', // slate-900
        },
        tabBarStyle: {
          height: 90, // Large height for massive touch targets
          backgroundColor: backgroundColor,
          borderTopWidth: 3,
          borderTopColor: borderColor,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          height: 70, // Generous height for touch target
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 16, // text-base
          fontWeight: 'bold', // Never use light fonts
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'VaultEase Home',
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons
              name={focused ? 'folder' : 'folder-outline'}
              size={32} // Large, clear icon
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          headerTitle: 'My Emails',
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons
              name={focused ? 'mail' : 'mail-outline'}
              size={32}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          headerTitle: 'Trusted Contacts',
          tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={32}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

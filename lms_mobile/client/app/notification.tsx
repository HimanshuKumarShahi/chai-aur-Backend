import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function Notifications() {
  const router = useRouter();
  const { user } = useUser();

  const adminEmail = process.env.EXPO_PUBLIC_ADMIN_EMAIL;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  // Check if Himanshu is looking at the screen
  const isAdmin = userEmail && adminEmail && userEmail.toLowerCase() === adminEmail.toLowerCase();

  // Mock Admin Requests (We will connect this to your DB later)
  const [adminRequests, setAdminRequests] = useState([
    { id: '1', studentName: 'Rahul Sharma', course: 'React Native Mastery', status: 'pending' },
    { id: '2', studentName: 'Priya Singh', course: 'Advanced Node.js', status: 'pending' }
  ]);

  // Mock Student Notifications
  const studentNotifications = [
    { id: '1', text: 'New Course added: Python AI!' }, 
    { id: '2', text: 'Your enrollment for Node.js was approved.' }
  ];

  const handleApprove = (id: string, name: string) => {
    Alert.alert("Approved", `${name} has been added to the course!`);
    setAdminRequests(prev => prev.filter(req => req.id !== id));
    // Later: Send API.post('/enroll/approve') to backend
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100 shadow-sm bg-white z-10">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">{isAdmin ? 'Enrollment Requests' : 'Notifications'}</Text>
      </View>

      {/* ADMIN VIEW */}
      {isAdmin ? (
        <FlatList 
          data={adminRequests}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">No pending requests.</Text>}
          renderItem={({ item }) => (
            <View className="p-5 border border-gray-100 rounded-3xl mb-4 bg-gray-50 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-orange-100 p-3 rounded-full"><Ionicons name="person-add" color="#EA580C" size={20}/></View>
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-base text-black">{item.studentName}</Text>
                  <Text className="text-gray-500 text-xs">Wants to join: {item.course}</Text>
                </View>
              </View>
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity className="flex-1 bg-gray-200 py-3 rounded-xl mr-2 items-center">
                  <Text className="text-black font-bold">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleApprove(item.id, item.studentName)} className="flex-1 bg-orange-600 py-3 rounded-xl ml-2 items-center">
                  <Text className="text-white font-bold">Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        /* STUDENT VIEW */
        <FlatList 
          data={studentNotifications}
          renderItem={({ item }) => (
            <View className="p-5 border-b border-gray-50 flex-row items-center">
              <View className="bg-orange-100 p-3 rounded-full"><Ionicons name="notifications" color="#EA580C" size={20}/></View>
              <Text className="ml-4 font-medium text-black flex-1">{item.text}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
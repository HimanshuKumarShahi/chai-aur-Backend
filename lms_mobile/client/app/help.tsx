import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpSupport() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Help & Support</Text>
      </View>
      
      <ScrollView className="p-5">
        <Text className="text-lg font-bold mb-4">Frequently Asked Questions</Text>
        {['How to enroll?', 'Payment issues', 'Offline downloads'].map((q, i) => (
          <TouchableOpacity key={i} className="bg-gray-50 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
            <Text className="text-black font-medium">{q}</Text>
            <Ionicons name="add" size={20} color="orange" />
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity className="bg-black p-5 rounded-3xl mt-10 flex-row items-center justify-center">
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
          <Text className="text-white font-bold ml-3">Chat with Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
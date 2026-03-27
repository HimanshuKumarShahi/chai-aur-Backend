import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function EnrolledCourses() {
  const router = useRouter();
  const myCourses = [
    { id: '1', title: 'React Native Mastery', progress: 0.5, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee' },
    { id: '2', title: 'Advanced Node.js', progress: 0.2, image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">My Learning</Text>
      </View>

      <FlatList
        data={myCourses}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white border border-gray-100 rounded-3xl p-4 mb-4 flex-row items-center shadow-sm">
            <Image source={{ uri: item.image }} className="w-20 h-20 rounded-2xl" />
            <View className="ml-4 flex-1">
              <Text className="font-bold text-lg">{item.title}</Text>
              <View className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <View className={`h-full bg-orange-600 w-[${item.progress * 100}%]`} style={{ width: `${item.progress * 100}%` }} />
              </View>
              <Text className="text-gray-400 text-xs mt-1">{item.progress * 100}% Completed</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
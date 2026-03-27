import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Added for navigation
import Header from '../../components/Header';

export default function Home() {
  const router = useRouter(); // Hook to handle navigation

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Reusable Branding Header */}
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} className="px-5">
        
        {/* Welcome Section */}
        <View className="mt-4">
          <Text className="text-gray-500 text-sm">Welcome back,</Text>
          <Text className="text-black text-2xl font-bold">Himanshu 👋</Text>
        </View>

        {/* Search Trigger (Navigate to search page) */}
        <TouchableOpacity 
          onPress={() => router.push('/search')}
          activeOpacity={0.8}
          className="flex-row items-center bg-gray-100 mt-5 p-4 rounded-2xl border border-gray-200"
        >
          <Ionicons name="search" size={20} color="gray" />
          <Text className="text-gray-400 ml-3 text-base">Search your courses...</Text>
        </TouchableOpacity>

        {/* Featured Banner */}
        <View className="bg-black mt-6 p-6 rounded-3xl flex-row items-center justify-between overflow-hidden">
          <View className="flex-1">
            <Text className="text-orange-500 font-bold text-3xl">60% OFF</Text>
            <Text className="text-white text-sm my-1">New Year Special Offer</Text>
            <TouchableOpacity 
               onPress={() => router.push('/Courses')}
               className="bg-orange-500 px-4 py-2 rounded-lg self-start mt-2"
            >
              <Text className="text-white font-bold">Explore</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="rocket" size={80} color="#FF8C00" style={{ opacity: 0.5 }} />
        </View>

        {/* Continue Learning Section */}
        <View className="mt-8 flex-row justify-between items-end">
          <Text className="text-xl font-bold text-black">In Progress</Text>
          <TouchableOpacity onPress={() => router.push('/enrolled-courses')}>
            <Text className="text-orange-500 font-semibold">View All</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          onPress={() => router.push('/enrolled-courses')}
          className="bg-white border border-gray-100 p-4 rounded-2xl mt-4 flex-row shadow-sm"
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070' }} 
            className="w-20 h-20 rounded-xl"
          />
          <View className="flex-1 ml-4 justify-center">
            <Text className="text-black font-bold text-lg" numberOfLines={1}>React Native Mastery</Text>
            {/* Custom Orange Progress Bar */}
            <View className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <View className="h-2 bg-orange-500 w-1/2" />
            </View>
            <Text className="text-gray-400 text-xs mt-1">50% Completed</Text>
          </View>
        </TouchableOpacity>

        {/* Popular Courses Section */}
        <View className="mt-8 mb-4">
          <Text className="text-xl font-bold text-black">Popular Courses</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10">
          {[1, 2, 3].map((item) => (
            <TouchableOpacity 
              key={item} 
              onPress={() => router.push('/Courses')}
              className="bg-white border border-gray-100 p-3 rounded-2xl mr-4 w-52 shadow-sm"
            >
              <Image 
                source={{ uri: `https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1931&sig=${item}` }} 
                className="w-full h-28 rounded-xl"
              />
              <Text className="text-black font-bold mt-3 text-md" numberOfLines={1}>Advanced Backend</Text>
              <Text className="text-orange-500 font-bold text-lg mt-1">₹ 399</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}
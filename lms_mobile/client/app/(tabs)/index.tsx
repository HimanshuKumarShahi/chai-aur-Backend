import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import Header from '../../components/Header';
import API from '../../api/axios';

interface Course {
  _id: string;
  title: string;
  discountPrice: number;
  thumbnail: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const response = await API.get('/courses');
        setPopularCourses(response.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularCourses();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} className="px-5">
        
        <View className="mt-4">
          <Text className="text-gray-500 text-sm">Welcome back,</Text>
          <Text className="text-black text-2xl font-bold">{user?.firstName || 'Student'} 👋</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/search')} className="flex-row items-center bg-gray-100 mt-5 p-4 rounded-2xl border border-gray-200">
          <Ionicons name="search" size={20} color="gray" />
          <Text className="text-gray-400 ml-3 text-base">Search your courses...</Text>
        </TouchableOpacity>

        <View className="bg-black mt-6 p-6 rounded-3xl flex-row items-center justify-between overflow-hidden">
          <View className="flex-1">
            <Text className="text-orange-500 font-bold text-3xl">60% OFF</Text>
            <Text className="text-white text-sm my-1">New Year Special Offer</Text>
            <TouchableOpacity onPress={() => router.push('/Courses')} className="bg-orange-500 px-4 py-2 rounded-lg self-start mt-2">
              <Text className="text-white font-bold">Explore</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="rocket" size={80} color="#FF8C00" style={{ opacity: 0.5 }} />
        </View>

        <View className="mt-8 mb-4">
          <Text className="text-xl font-bold text-black">Popular Courses</Text>
        </View>
        
        {loading ? (
           <ActivityIndicator size="small" color="#EA580C" />
        ) : popularCourses.length === 0 ? (
           <View className="bg-gray-50 p-6 rounded-2xl items-center justify-center border border-gray-100 mb-10">
             <Text className="text-gray-400 font-medium text-base">No courses available right now.</Text>
           </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10">
            {popularCourses.map((item) => (
              <TouchableOpacity key={item._id} onPress={() => router.push('/Courses')} className="bg-white border border-gray-100 p-3 rounded-2xl mr-4 w-52 shadow-sm">
                <Image source={{ uri: item.thumbnail || 'https://via.placeholder.com/150' }} className="w-full h-28 rounded-xl" resizeMode="cover" />
                <Text className="text-black font-bold mt-3 text-md" numberOfLines={1}>{item.title}</Text>
                {/* Fixed the mapping here to use discountPrice */}
                <Text className="text-orange-500 font-bold text-lg mt-1">₹ {item.discountPrice}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
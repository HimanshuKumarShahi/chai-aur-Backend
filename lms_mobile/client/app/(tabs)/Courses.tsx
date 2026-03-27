import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo'; 
import Header from '../../components/Header';
import API from '../../api/axios';

interface Course {
  _id: string;
  title: string;
  instructor: string;
  discountPrice: number;
  originalPrice: number;
  thumbnail: string;
  tag?: string;
}

export default function Courses() {
  const { getToken } = useAuth(); 
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Send request to Admin
  const handleEnrollRequest = async (courseId: string, courseTitle: string) => {
    Alert.alert(
      "Enrollment Request Sent",
      `Your request to join "${courseTitle}" has been sent to the Admin (Himanshu) for approval.`,
      [{ text: "OK" }]
    );
    // Note: We will wire this up to a real backend route in the next step!
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#EA580C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-black">Explore Courses</Text>
        <Text className="text-gray-500 text-sm">Pick the best for your career</Text>
      </View>

      {courses.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-gray-400">No courses available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id} 
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9} className="bg-white border border-gray-100 rounded-[30px] mb-6 overflow-hidden shadow-sm">
              <Image source={{ uri: item.thumbnail || 'https://via.placeholder.com/400x200' }} className="w-full h-44" resizeMode="cover" />
              <View className="absolute top-3 left-3 bg-orange-600 px-3 py-1 rounded-full">
                <Text className="text-white text-[10px] font-bold uppercase">{item.tag || 'New'}</Text>
              </View>

              <View className="p-4">
                <Text className="text-black font-bold text-lg leading-tight mb-2" numberOfLines={2}>{item.title}</Text>
                
                <View className="flex-row items-center mb-3">
                  <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="person" size={12} color="gray" />
                  </View>
                  <Text className="text-gray-600 text-sm ml-2">By {item.instructor || 'Himanshu Sir'}</Text>
                </View>

                <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
                  <View className="flex-row items-center">
                    <Text className="text-black font-bold text-xl">₹{item.discountPrice}</Text>
                    {item.originalPrice && (
                      <Text className="text-gray-400 text-sm ml-2 line-through">₹{item.originalPrice}</Text>
                    )}
                  </View>
                  
                  <TouchableOpacity onPress={() => handleEnrollRequest(item._id, item.title)} className="bg-black px-5 py-2 rounded-2xl">
                    <Text className="text-white font-bold text-xs">Enroll Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const courseData = [
  {
    id: '1',
    title: 'Full Stack Backend Masterclass',
    instructor: 'Himanshu Sir',
    discountPrice: '₹999',
    originalPrice: '₹2,499',
    rating: '4.8',
    students: '1.2k',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070',
    tag: 'Bestseller'
  },
  {
    id: '2',
    title: 'UI/UX Design Strategy 2026',
    instructor: 'Anjali Sharma',
    discountPrice: '₹599',
    originalPrice: '₹1,599',
    rating: '4.9',
    students: '850',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070',
    tag: 'New'
  },
];

export default function Courses() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-black">Explore Courses</Text>
        <Text className="text-gray-500 text-sm">Pick the best for your career</Text>
      </View>

      <FlatList
        data={courseData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            className="bg-white border border-gray-100 rounded-[30px] mb-6 overflow-hidden shadow-sm"
          >
            {/* Course Image */}
            <Image 
              source={{ uri: item.image }} 
              className="w-full h-44"
              resizeMode="cover"
            />
            
            {/* Bestseller Tag Overlay */}
            <View className="absolute top-3 left-3 bg-orange-600 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-bold uppercase">{item.tag}</Text>
            </View>

            <View className="p-4">
              {/* Category & Rating */}
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-orange-600 text-xs font-bold uppercase">Development</Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text className="text-black font-bold text-xs ml-1">{item.rating}</Text>
                  <Text className="text-gray-400 text-xs"> ({item.students})</Text>
                </View>
              </View>

              {/* Title */}
              <Text className="text-black font-bold text-lg leading-tight mb-2" numberOfLines={2}>
                {item.title}
              </Text>

              {/* Instructor Info */}
              <View className="flex-row items-center mb-3">
                <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center">
                  <Ionicons name="person" size={12} color="gray" />
                </View>
                <Text className="text-gray-600 text-sm ml-2">By {item.instructor}</Text>
              </View>

              {/* Pricing Section */}
              <View className="flex-row items-center justify-between border-t border-gray-50 pt-3">
                <View className="flex-row items-center">
                  <Text className="text-black font-bold text-xl">{item.discountPrice}</Text>
                  <Text className="text-gray-400 text-sm ml-2 line-through">{item.originalPrice}</Text>
                </View>
                
                <TouchableOpacity className="bg-black px-5 py-2 rounded-2xl">
                  <Text className="text-white font-bold text-xs">Enroll Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
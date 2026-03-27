import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

// Mock data with thumbnail URLs
const downloadData = [
  { 
    id: '1', 
    name: 'Introduction to NodeJS', 
    type: 'video', 
    size: '45 MB',
    thumbnail: 'https://images.unsplash.com/photo-1533709752211-118fcaf03312?q=80&w=2070' 
  },
  { 
    id: '2', 
    name: 'React Native Cheatsheet', 
    type: 'pdf', 
    size: '2.1 MB',
    thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=1964' 
  },
  { 
    id: '3', 
    name: 'Database Architecture', 
    type: 'image', 
    size: '800 KB',
    thumbnail: 'https://images.pexels.com/photos/36644715/pexels-photo-36644715.jpeg' 
  },
];

export default function Downloads() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      <View className="px-5 flex-1">
        <View className="mt-6 mb-4">
          <Text className="text-2xl font-bold text-black">Offline Library</Text>
          <Text className="text-gray-400 text-sm">Save your favorite lessons for offline access</Text>
        </View>

        <FlatList
          data={downloadData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white p-3 rounded-3xl mb-4 flex-row items-center border border-gray-100 shadow-sm">
              
              {/* --- PREVIEW SECTION --- */}
              <View className="relative">
                <Image 
                  source={{ uri: item.thumbnail }} 
                  className="w-20 h-20 rounded-2xl bg-gray-200"
                />
                {/* File Type Overlay Icon */}
                <View className="absolute inset-0 items-center justify-center bg-black/20 rounded-2xl">
                  <Ionicons 
                    name={item.type === 'video' ? 'play-circle' : item.type === 'pdf' ? 'document-text' : 'image'} 
                    size={24} 
                    color="white" 
                  />
                </View>
              </View>

              {/* --- INFO SECTION --- */}
              <View className="ml-4 flex-1">
                <Text className="text-black font-bold text-base leading-tight" numberOfLines={2}>
                  {item.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-gray-400 text-xs uppercase font-semibold">{item.type}</Text>
                  <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                  <Text className="text-gray-400 text-xs">{item.size}</Text>
                </View>
              </View>

              {/* --- DOWNLOAD BUTTON --- */}
              <TouchableOpacity 
                className="bg-orange-600 w-10 h-10 rounded-full items-center justify-center shadow-lg shadow-orange-600/50"
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={25} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
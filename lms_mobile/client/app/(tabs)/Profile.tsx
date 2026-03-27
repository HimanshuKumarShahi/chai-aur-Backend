import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', route: '/edit-profile' },
    { icon: 'book-outline', label: 'My Enrolled Courses', route: '/enrolled-courses' },
    { icon: 'settings-outline', label: 'App Settings', route: '/settings' },
    { icon: 'help-circle-outline', label: 'Help & Support', route: '/help' },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => console.log("Logged out") }
    ]);
  };

  const handleCamera = () => {
    Alert.alert("Profile Photo", "Upload or take a new photo.");
    // Later: Use expo-image-picker here to upload to Cloudinary
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="px-5">
        <View className="items-center mt-8">
          <View className="relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080' }} 
              className="w-32 h-32 rounded-full border-4 border-orange-600"
            />
            <TouchableOpacity 
              onPress={handleCamera}
              className="absolute bottom-0 right-0 bg-black p-2 rounded-full border-2 border-white"
            >
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-black mt-4">Himanshu</Text>
          <Text className="text-gray-500">himanshu@example.com</Text>
        </View>

        <View className="flex-row justify-around bg-black rounded-3xl p-6 mt-8 shadow-lg">
          <View className="items-center">
            <Text className="text-orange-600 text-xl font-bold">12</Text>
            <Text className="text-white text-xs">Courses</Text>
          </View>
          <View className="h-full w-[1px] bg-gray-800" />
          <View className="items-center">
            <Text className="text-orange-600 text-xl font-bold">05</Text>
            <Text className="text-white text-xs">Certificates</Text>
          </View>
          <View className="h-full w-[1px] bg-gray-800" />
          <View className="items-center">
            <Text className="text-orange-600 text-xl font-bold">08</Text>
            <Text className="text-white text-xs">Pending</Text>
          </View>
        </View>

        <View className="mt-8">
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => router.push(item.route as any)}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon as any} size={22} color="black" />
                <Text className="ml-4 text-black text-lg font-medium">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center justify-center mt-10 mb-10 py-4 bg-gray-100 rounded-2xl"
        >
          <Ionicons name="log-out-outline" size={22} color="red" />
          <Text className="ml-2 text-red-600 font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
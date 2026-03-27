import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import API from '../api/axios';

export default function AdminPanel() {
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    instructor: 'Himanshu Sir',
    originalPrice: '',
    discountPrice: '',
    category: 'Development'
  });
  const [image, setImage] = useState<string | null>(null);

  // Function to pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!form.title || !form.discountPrice || !image) {
      Alert.alert("Error", "Please fill Title, Price and select an Image.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      // Create FormData for Multer (Backend)
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('instructor', form.instructor);
      formData.append('originalPrice', form.originalPrice);
      formData.append('discountPrice', form.discountPrice);
      formData.append('category', form.category);
      
      // Append the image file
      const filename = image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore - React Native FormData requires this structure
      formData.append('thumbnail', { uri: image, name: filename, type });

      const response = await API.post('/courses/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        Alert.alert("Success", "Course uploaded successfully!");
        router.back();
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      Alert.alert("Upload Failed", error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Add New Course</Text>
      </View>

      <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
        {/* Image Picker Section */}
        <TouchableOpacity 
          onPress={pickImage}
          className="w-full h-48 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden mb-6"
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" />
          ) : (
            <View className="items-center">
              <Ionicons name="image-outline" size={40} color="gray" />
              <Text className="text-gray-400 mt-2 font-medium">Select Course Thumbnail</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Inputs */}
        <View className="space-y-4 mb-10">
          <View>
            <Text className="text-gray-500 mb-2 ml-1">Course Title</Text>
            <TextInput 
              className="bg-gray-50 p-4 rounded-2xl border border-gray-200"
              placeholder="e.g. Full Stack MERN Masterclass"
              onChangeText={(txt) => setForm({...form, title: txt})}
            />
          </View>

          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Text className="text-gray-500 mb-2 ml-1">Discount Price (₹)</Text>
              <TextInput 
                className="bg-gray-50 p-4 rounded-2xl border border-gray-200"
                placeholder="999"
                keyboardType="numeric"
                onChangeText={(txt) => setForm({...form, discountPrice: txt})}
              />
            </View>
            <View className="w-[48%]">
              <Text className="text-gray-500 mb-2 ml-1">Original Price (₹)</Text>
              <TextInput 
                className="bg-gray-50 p-4 rounded-2xl border border-gray-200"
                placeholder="2499"
                keyboardType="numeric"
                onChangeText={(txt) => setForm({...form, originalPrice: txt})}
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-500 mb-2 ml-1">Description</Text>
            <TextInput 
              className="bg-gray-50 p-4 rounded-2xl border border-gray-200 h-32"
              placeholder="Describe what students will learn..."
              multiline
              textAlignVertical="top"
              onChangeText={(txt) => setForm({...form, description: txt})}
            />
          </View>

          <TouchableOpacity 
            onPress={handleUpload}
            disabled={loading}
            className="bg-orange-600 p-5 rounded-2xl items-center mt-4 shadow-lg shadow-orange-500/40"
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Publish Course</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
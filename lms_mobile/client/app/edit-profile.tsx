import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import API from '../api/axios';

export default function EditProfile() {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.fullName || '');

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      // This sends the update to your MongoDB
      await API.post('/users/sync', { 
        name: name,
        email: user?.primaryEmailAddress?.emailAddress,
        image: user?.imageUrl
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      Alert.alert("Success", "Profile updated in Database!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Edit Profile</Text>
      <View className="mb-4">
        <Text className="text-gray-500 mb-2">Full Name</Text>
        <TextInput 
          value={name}
          onChangeText={setName}
          className="bg-gray-50 p-4 rounded-2xl border border-gray-200"
        />
      </View>
      <TouchableOpacity 
        onPress={handleUpdate}
        className="bg-orange-600 p-5 rounded-2xl items-center mt-4"
      >
        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Save Changes</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
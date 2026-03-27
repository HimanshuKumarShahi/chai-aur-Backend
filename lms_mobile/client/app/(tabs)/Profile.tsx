import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo'; 
import API from '../../api/axios'; 

export default function Profile() {
  const router = useRouter();
  const { signOut, getToken } = useAuth(); 
  const { user: clerkUser, isLoaded } = useUser(); 
  
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- ADMIN LOGIC ---
  const adminEmailFromEnv = process.env.EXPO_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  const currentUserEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
  
  // This is the "Bouncer" - if this is false, you won't see the buttons
  const isAdmin = currentUserEmail && adminEmailFromEnv && currentUserEmail === adminEmailFromEnv;

  useEffect(() => {
    const fetchRealUserFromDB = async () => {
      if (!isLoaded) return; 
      try {
        const token = await getToken();
        const response = await API.post('/users/sync', {
          name: clerkUser?.fullName, 
          email: clerkUser?.primaryEmailAddress?.emailAddress,
          image: clerkUser?.imageUrl
        }, { headers: { Authorization: `Bearer ${token}` } });
        setDbUser(response.data);
      } catch (error) {
        console.error("Sync error");
      } finally {
        setLoading(false);
      }
    };
    fetchRealUserFromDB();
  }, [clerkUser, isLoaded]);

  if (loading) return <View className="flex-1 justify-center"><ActivityIndicator color="#EA580C" /></View>;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="px-5">
        
        {/* PROFILE HEADER */}
        <View className="items-center mt-8">
          <Image 
            source={{ uri: dbUser?.image || clerkUser?.imageUrl || 'https://via.placeholder.com/150' }} 
            className="w-32 h-32 rounded-full border-4 border-orange-600"
          />
          <Text className="text-2xl font-bold text-black mt-4">{dbUser?.name || clerkUser?.fullName}</Text>
          
          {isAdmin ? (
            <View className="bg-orange-600 px-4 py-1 rounded-full mt-2">
              <Text className="text-white font-bold text-xs uppercase">System Admin</Text>
            </View>
          ) : (
            <Text className="text-gray-500">{currentUserEmail}</Text>
          )}
        </View>

        {/* --- ADMIN SECTION: ONLY VISIBLE TO HIMANSHU --- */}
        {isAdmin && (
          <View className="mt-8">
            <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Admin Management</Text>
            
            {/* BUTTON 1: ADD COURSES */}
            <TouchableOpacity 
              onPress={() => router.push('/admin-panel')}
              className="flex-row items-center bg-orange-600 p-5 rounded-3xl mb-3 shadow-lg shadow-orange-500/30"
            >
              <Ionicons name="add-circle" size={26} color="white" />
              <View className="ml-4">
                <Text className="text-white font-bold text-lg">Add New Course</Text>
                <Text className="text-orange-100 text-xs">Upload videos, thumbnails & prices</Text>
              </View>
            </TouchableOpacity>

            {/* BUTTON 2: ENROLLMENT REQUESTS */}
            <TouchableOpacity 
              onPress={() => router.push('/notification')}
              className="flex-row items-center bg-black p-5 rounded-3xl mb-6"
            >
              <Ionicons name="people" size={26} color="white" />
              <View className="ml-4">
                <Text className="text-white font-bold text-lg">Student Requests</Text>
                <Text className="text-gray-400 text-xs">Approve or Reject enrollments</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* --- REGULAR MENU --- */}
        <View className="mt-4">
          <Text className="text-gray-400 font-bold mb-3 ml-1 uppercase text-xs tracking-widest">Account Settings</Text>
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
             <View className="flex-row items-center"><Ionicons name="person-outline" size={22}/><Text className="ml-4 text-lg">Edit Profile</Text></View>
             <Ionicons name="chevron-forward" size={20} color="gray"/>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => signOut()} className="flex-row items-center justify-center mt-10 py-4 bg-gray-100 rounded-2xl">
            <Text className="text-red-600 font-bold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* DEBUG BOX: If you don't see admin buttons, look at this */}
        <View className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-50">
          <Text className="text-[10px] text-gray-400">DEBUG INFO:</Text>
          <Text className="text-[10px] text-gray-400">Env Email: {adminEmailFromEnv}</Text>
          <Text className="text-[10px] text-gray-400">Your Email: {currentUserEmail}</Text>
          <Text className="text-[10px] text-gray-400">Match: {isAdmin ? "YES" : "NO"}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
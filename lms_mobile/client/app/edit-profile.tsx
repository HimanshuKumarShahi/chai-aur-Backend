import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Edit Profile</Text>
      </View>
      <View className="p-5 space-y-4">
        <View>
          <Text className="text-gray-500 mb-2">Full Name</Text>
          <TextInput className="bg-gray-50 p-4 rounded-2xl border border-gray-200" defaultValue="Himanshu" />
        </View>
        <TouchableOpacity className="bg-orange-600 p-5 rounded-2xl items-center mt-5">
          <Text className="text-white font-bold text-lg">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header() {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-orange-500">
      <View className="flex-row items-center">
        <View className="bg-orange-600 p-2 rounded-xl mr-2">
          <Text className="text-white font-bold text-xl leading-none">AH</Text>
        </View>
        <Text className="text-black font-bold text-lg">Academy</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/notification')} className="bg-gray-100 p-2 rounded-full">
        <Ionicons name="notifications-outline" size={24} color="black" />
        <View className="absolute right-2.5 top-2.5 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-white" />
      </TouchableOpacity>
    </View>
  );
}
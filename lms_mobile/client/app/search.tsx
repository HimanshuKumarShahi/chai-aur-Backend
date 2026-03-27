import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Search() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <View className="flex-1 bg-gray-100 ml-4 rounded-xl px-4 py-2 flex-row items-center">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput className="flex-1 ml-2 h-10" placeholder="Type here..." autoFocus />
        </View>
      </View>
      <View className="p-10 items-center"><Text className="text-gray-400">Search for something amazing!</Text></View>
    </SafeAreaView>
  );
}
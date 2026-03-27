import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">App Settings</Text>
      </View>
      <View className="p-5">
        <View className="flex-row justify-between items-center py-4 border-b border-gray-50">
          <Text className="text-lg font-medium">Push Notifications</Text>
          <Switch value={true} trackColor={{ true: '#EA580C' }} />
        </View>
        <TouchableOpacity className="py-4 border-b border-gray-50">
          <Text className="text-lg font-medium">Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
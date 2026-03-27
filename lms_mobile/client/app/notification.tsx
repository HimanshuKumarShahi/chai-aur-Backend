import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Notifications() {
  const router = useRouter();
  const data = [{ id: '1', text: 'New Course added!' }, { id: '2', text: 'Assignment Deadline tomorrow.' }];
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Notifications</Text>
      </View>
      <FlatList 
        data={data}
        renderItem={({ item }) => (
          <View className="p-5 border-b border-gray-50 flex-row items-center">
            <View className="bg-orange-100 p-3 rounded-full"><Ionicons name="notifications" color="#EA580C" size={20}/></View>
            <Text className="ml-4 font-medium">{item.text}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
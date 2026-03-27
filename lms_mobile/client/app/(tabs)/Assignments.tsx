import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

export default function Assignments() {
  const tasks = [{ id: '1', name: 'Build Login UI', status: 'Pending' }, { id: '2', name: 'Setup MongoDB', status: 'Submitted' }];
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      <FlatList 
        data={tasks}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View className="bg-gray-50 border border-gray-100 p-5 rounded-3xl mb-4 flex-row justify-between items-center">
            <View>
              <Text className="font-bold text-lg">{item.name}</Text>
              <Text className="text-gray-400">Due: 24 Oct 2026</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${item.status === 'Pending' ? 'bg-orange-600' : 'bg-black'}`}>
              <Text className="text-white text-xs font-bold">{item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { machines, pendingCount, role } = useStore();
  const navigation = useNavigation();

  const renderMachine = ({ item }) => (
    <TouchableOpacity
      className="p-4 border-b"
      onPress={() => navigation.navigate('Machine', { machine: item })}
    >
      <Text className="text-lg">{item.name}</Text>
      <Text className={`text-sm ${item.status === 'RUN' ? 'text-green-500' : item.status === 'IDLE' ? 'text-yellow-500' : 'text-red-500'}`}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl mb-4">Machines</Text>
      {pendingCount > 0 && <Text className="text-red-500">Pending: {pendingCount}</Text>}
      <FlatList data={machines} renderItem={renderMachine} keyExtractor={item => item.id} />
      {role === 'supervisor' && (
        <TouchableOpacity className="bg-blue-500 p-2 mt-4" onPress={() => navigation.navigate('Alerts')}>
          <Text className="text-white">View Alerts</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity className="bg-gray-500 p-2 mt-2" onPress={() => navigation.navigate('Reports')}>
        <Text className="text-white">Reports</Text>
      </TouchableOpacity>
    </View>
  );
}

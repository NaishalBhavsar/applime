import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MachineScreen() {
  const { params } = useRoute();
  const { machine } = params;
  const { role } = useStore();
  const navigation = useNavigation();

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl">{machine.name}</Text>
      <Text>Status: {machine.status}</Text>
      {role === 'operator' && (
        <>
          <TouchableOpacity className="bg-blue-500 p-2 mt-4" onPress={() => navigation.navigate('Downtime', { machine })}>
            <Text className="text-white">Downtime</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-500 p-2 mt-2" onPress={() => navigation.navigate('Maintenance', { machine })}>
            <Text className="text-white">Maintenance</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

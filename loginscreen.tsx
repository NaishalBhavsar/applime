import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'operator' | 'supervisor'>('operator');
  const login = useStore(state => state.login);

  const handleLogin = () => {
    if (email) login(email, role);
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl mb-4">Login</Text>
      <TextInput
        className="border p-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        className={`p-2 mb-2 ${role === 'operator' ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={() => setRole('operator')}
      >
        <Text>Operator</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`p-2 mb-4 ${role === 'supervisor' ? 'bg-blue-500' : 'bg-gray-300'}`}
        onPress={() => setRole('supervisor')}
      >
        <Text>Supervisor</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-green-500 p-2" onPress={handleLogin}>
        <Text className="text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
}

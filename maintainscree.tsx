import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useStore } from '../store/useStore';
import { useRoute } from '@react-navigation/native';

export default function MaintenanceScreen() {
  const { params } = useRoute();
  const { machine } = params;
  const { maintenanceItems, update

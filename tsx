import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux'; // Wait, no: We're using Zustand, not Redux. Mistake in thought. Zustand doesn't need Provider; it's global.
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MachineScreen from './screens/MachineScreen';
import DowntimeScreen from './screens/DowntimeScreen';
import MaintenanceScreen from './screens/MaintenanceScreen';
import AlertsScreen from './screens/AlertsScreen';
import ReportsScreen from './screens/ReportsScreen';
import { useStore } from './store/useStore'; // Zustand store
import { AlertTimer } from './utils/AlertTimer'; // Simulate alerts

const Stack = createStackNavigator();

export default function App() {
  const { isLoggedIn, role } = useStore();

  React.useEffect(() => {
    AlertTimer.start(); // Start fake alert generation
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Machine" component={MachineScreen} />
            <Stack.Screen name="Downtime" component={DowntimeScreen} />
            <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
            <Stack.Screen name="Alerts" component={AlertsScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

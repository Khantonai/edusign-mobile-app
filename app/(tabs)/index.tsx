import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../(auth)/login';
import RegisterScreen from '../(auth)/register';
import ScanScreen from './scan';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/auth-context';

const Stack = createNativeStackNavigator();


export default function App() {

  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

useEffect(() => {
  setLoading(false);
}, [token]);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Scan" component={ScanScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '@/context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      Alert.alert('Login successful', 'You are now logged in');
      // Optionally navigate to a different screen after login
      // router.replace("/(tabs)"); // Adjust this to your home screen name
    } else {
      Alert.alert('Login failed', result.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ marginBottom: 10 }} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
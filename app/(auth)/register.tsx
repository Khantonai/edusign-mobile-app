import { useAuth } from '@/context/auth-context';
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const { register } = useAuth();


  const handleRegister = async () => {
    const result = await register(name, email, password, password_confirmation);
    if (result.success) {
      Alert.alert('Registration successful', 'You can now log in');
      // navigation.navigate('Login'); // Navigate to login screen after successful registration
    } else {
      Alert.alert('Registration failed', result.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Confirm Password" secureTextEntry value={password_confirmation} onChangeText={setConfirmPassword} style={{ marginBottom: 10 }} />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { Button, Input } from 'react-native-elements';
import { Link, router } from 'expo-router';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    const result = await login(email, password);
    if (result.success) {
      Alert.alert('Connexion réussie', 'Bienvenue !');
      router.replace('/(tabs)');
    } else {
      setError(result.message || 'Connexion échouée');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <Text style={styles.title}>Se connecter</Text>

      <Text style={{ color: "red" }}>
        {error}
      </Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email"
        errorStyle={{ display: 'none' }}
        inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <Input
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        label="Mot de passe"
        errorStyle={{ display: 'none' }}
        inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <View style={styles.buttonCont}>
        <Button title="Se connecter" onPress={handleLogin} buttonStyle={styles.mainButton} titleStyle={{ color: "black" }} />
        <Link href={"/(auth)/register"} replace style={styles.secondaryButton}>Pas de compte ? S'inscrire</Link>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
  buttonCont: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  mainButton: {
    backgroundColor: '#f8ac32',
    paddingVertical: 10,
    borderRadius: 10,
  },
  secondaryButton: {
    alignSelf: 'center',
    color: '#4ca4c2',
  },
});
import { useAuth } from '@/context/auth-context';
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Input, Button } from 'react-native-elements';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const { register } = useAuth();


  const handleRegister = async () => {
    setError('');
    const result = await register(name, email, password, password_confirmation);
    if (result.success) {
      Alert.alert('Enregistrement réussi', 'Vous pouvez maintenant vous connecter');
      router.replace('/(tabs)');
    } else {
      setError(result.message || 'Inscription échouée');

    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View>
        <Text style={styles.title}>S'inscrire</Text>
        <Text>Interface pour les élèves</Text>
      </View>


      <Text style={{ color: "red" }}>
        {error}
      </Text>

      <Input placeholder="Nom" value={name} onChangeText={setName} label="Nom" errorStyle={{ display: 'none' }} style={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <Input placeholder="Email" value={email} onChangeText={setEmail} label="Email" errorStyle={{ display: 'none' }} style={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <Input placeholder="Mot de Passe" secureTextEntry value={password} onChangeText={setPassword} label="Mot de Passe" errorStyle={{ display: 'none' }} style={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <Input placeholder="Confirmer le mot de passe" secureTextEntry value={password_confirmation} onChangeText={setConfirmPassword} label="Confirmer le mot de passe" errorStyle={{ display: 'none' }} style={styles.input} inputContainerStyle={{ borderBottomWidth: 0 }}
      />
      <View style={styles.buttonCont}>
        <Button title="S'inscrire" onPress={handleRegister} buttonStyle={styles.mainButton} titleStyle={{ color: "black" }} />
        <Link href={"/(auth)/login"} replace style={styles.secondaryButton}>Déjà un compte ? Se connecter</Link>
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
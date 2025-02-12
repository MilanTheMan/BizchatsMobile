import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await AsyncStorage.setItem(`username_${email}`, username);
      await AsyncStorage.setItem(`password_${email}`, password);
      Alert.alert('Success', 'Account created! You can now log in.');
      navigation.replace('Login');
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred while signing up');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  label: { alignSelf: 'flex-start', marginLeft: '5%', fontSize: 14, fontWeight: 'bold' },
  input: { width: '90%', padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', backgroundColor: '#fff' },
  signUpButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, width: '90%', alignItems: 'center', marginTop: 20 },
  signUpButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: { marginTop: 20, color: '#007AFF', fontSize: 14 },
});

export default SignUpScreen;
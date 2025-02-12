import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem(`username_${email}`);
        if (storedUsername) setUsername(storedUsername);
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    };

    if (email) fetchUserData();
  }, [email]); // Runs when email is updated

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const storedPassword = await AsyncStorage.getItem(`password_${email}`);
      if (storedPassword === password) {
        await AsyncStorage.setItem('currentUserEmail', email);
        await AsyncStorage.setItem('currentUserUsername', username);
        console.log('Login successful');
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred while logging in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  label: { alignSelf: 'flex-start', marginLeft: '5%', fontSize: 14, fontWeight: 'bold' },
  input: { width: '90%', padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 5, borderColor: '#ccc', backgroundColor: '#fff' },
  loginButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, width: '90%', alignItems: 'center', marginTop: 20 },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signUpText: { marginTop: 20, color: '#007AFF', fontSize: 14 },
});

export default LoginScreen;

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import sqlService from '../../services/sqlService';
import { UserContext } from '../../context/UserContext';

const SignUpScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await sqlService.signup({
        name,
        email,
        password,
        role_id: 1,
        profile_picture: null
      });

      if (response.success) {
        setUser(response.data);
        Alert.alert('Success', 'Account created! Redirecting to Home...');
        navigation.replace('HomeScreen');
      } else {
        Alert.alert('Error', response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'An error occurred while signing up');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Enter your password" value={password} secureTextEntry onChangeText={setPassword} />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="Confirm your password" value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} />

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

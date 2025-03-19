import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import sqlService from '../../services/sqlService';
import { UserContext } from '../../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
      if (!email.trim() || !password.trim()) {
          Alert.alert('Error', 'Please enter email and password');
          return;
      }

      try {
          const response = await sqlService.login({ email, password });

          if (response.success) {
              setUser(response.data);
              Alert.alert('Success', 'Login successful!');
              navigation.replace('HomeScreen');
          } else {
              Alert.alert('Error', response.message || 'Login failed');
          }
      } catch (error) {
          console.error('Login error:', error);
          Alert.alert('Error', 'An error occurred during login');
      }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.togglePassword}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
      </TouchableOpacity>

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
  togglePassword: { color: '#007AFF', fontSize: 14, marginTop: 10 },
});

export default LoginScreen;

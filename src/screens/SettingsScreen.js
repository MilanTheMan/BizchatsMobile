import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('currentUserEmail');
      const storedUsername = await AsyncStorage.getItem('currentUserUsername');
      const storedPassword = await AsyncStorage.getItem(`password_${storedEmail}`);

      if (storedEmail) setEmail(storedEmail);
      if (storedUsername) setUsername(storedUsername);
      if (storedPassword) setPassword(storedPassword);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!username.trim() || !email.trim() || !password.trim()) {
        Alert.alert('Error', 'All fields must be filled.');
        return;
      }

      await AsyncStorage.setItem('currentUserEmail', email);
      await AsyncStorage.setItem('currentUserUsername', username);
      await AsyncStorage.setItem(`password_${email}`, password);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Enter your password"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.friendsButton}
        onPress={() => navigation.navigate('Friends')}
      >
        <Text style={styles.friendsButtonText}>Friends</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#007AFF' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  friendsButton: {
    backgroundColor: '#34A853',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  friendsButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default SettingsScreen;
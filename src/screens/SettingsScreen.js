import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import sqlService from '../../services/sqlService';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileUri, setProfileUri] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed) {
      setUser(parsed);
      setProfileUri(parsed.profile_picture || null);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) return Alert.alert('Please enter a new email');
    try {
      await sqlService.updateUserEmail({ userId: user.id, email: newEmail });
      setNewEmail('');
      Alert.alert('Email updated successfully');
      loadUser();
    } catch (error) {
      Alert.alert('Failed to update email');
      console.error(error);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword.trim()) return Alert.alert('Enter a new password');
    try {
      await sqlService.resetUserPassword({ userId: user.id, newPassword });
      setNewPassword('');
      Alert.alert('Password updated');
    } catch (error) {
      Alert.alert('Failed to update password');
      console.error(error);
    }
  };


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileUri(uri);

      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('file', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      try {
        await sqlService.updateProfilePicture(formData);
        Alert.alert('Profile picture updated');
        loadUser();
      } catch (error) {
        Alert.alert('Upload failed');
        console.error(error);
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Settings</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profileUri
              ? { uri: profileUri }
              : require('../../assets/profile_icon.png')
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.label}>Email: {user?.email}</Text>

        <TextInput
          style={styles.input}
          placeholder="New email"
          value={newEmail}
          onChangeText={setNewEmail}
        />
        <TouchableOpacity style={styles.blueButton} onPress={handleEmailUpdate}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="New password"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#ccc"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.greenButton} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const BLUE = '#007AFF';

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#f9fafb',
  },
  header: {
    fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#111',
  },
  section: {
    marginVertical: 15,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  blueButton: {
    backgroundColor: BLUE,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: BLUE,
    borderWidth: 3,
    marginBottom: 20,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import sqlService from '../../services/sqlService';

const roleLabels = {
  1: 'Student',
  2: 'Teacher',
  3: 'Admin',
  4: 'Owner',
};

const ChannelSettingsScreen = ({ route }) => {
  const { channelId, className } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState(className);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchChannelInfo();
    fetchMembers();
  }, []);

  const fetchChannelInfo = async () => {
    try {
      const res = await sqlService.getChannel(channelId);
      setChannelName(res.data?.name || className);
      setProfileImage(res.data?.profile_picture || null);
    } catch (err) {
      console.error('Error fetching channel info:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await sqlService.getChannelMembers(channelId);
      setMembers(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching members:', error);
      Alert.alert('Error', 'Could not fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChannelName = async () => {
    try {
      await sqlService.updateChannelName({ channelId, name: channelName });
      Alert.alert('Success', 'Channel name updated');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update channel name');
    }
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setProfileImage(image.uri);
      await uploadImage(image);
    }
  };

  const uploadImage = async (image) => {
    try {
      const file = {
        uri: image.uri,
        name: 'channel_pic.jpg',
        type: 'image/jpeg',
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('channelId', channelId);

      await sqlService.updateChannelPicture(formData);
      Alert.alert('Success', 'Profile picture updated');
    } catch (err) {
      console.error('Image upload failed:', err);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.roleText}>{roleLabels[item.role_id] || 'Unknown Role'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Channel Settings</Text>

      <Text style={styles.sectionTitle}>General Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Channel Name"
        value={channelName}
        onChangeText={setChannelName}
      />
      <TouchableOpacity style={styles.blueButton} onPress={handleUpdateChannelName}>
        <Text style={styles.blueButtonText}>Update Name</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Profile Picture</Text>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text>No Image</Text>
        </View>
      )}
      <TouchableOpacity style={styles.fileButton} onPress={handleChooseImage}>
        <Text style={styles.fileButtonText}>Choose Image</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Members</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No members found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '600', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  blueButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  blueButtonText: { color: '#fff', fontWeight: 'bold' },
  fileButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  fileButtonText: { color: '#fff', fontWeight: 'bold' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  roleText: { fontSize: 14, color: '#444', marginTop: 4, fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 30 },
});

export default ChannelSettingsScreen;

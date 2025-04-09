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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import sqlService from '../../services/sqlService';

const roleLabels = {
  1: 'Owner',
  2: 'Administrator',
  3: 'Member',
};



const ChannelSettingsScreen = ({ route }) => {
  const { channelId, className } = route.params;
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState(className);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
      fetchChannelInfo();
      fetchMembers();
    };
    init();
  }, []);

  const fetchChannelInfo = async () => {
    try {
      const res = await sqlService.getChannel(channelId);
      const picture = res.data?.profile_picture;
      setChannelName(res.data?.name || className);
      if (picture) {
        setProfileImage(`${picture}?t=${Date.now()}`);
      }
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
      fetchChannelInfo();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update channel name');
    }
  };

  const handleChooseImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please allow access to your media library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        await uploadImage(image);
      }
    } catch (err) {
      console.error('❌ Error during image pick:', err);
    }
  };

  const uploadImage = async (image) => {
    try {
      setUploading(true);
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
      fetchChannelInfo();
    } catch (err) {
      console.error('Image upload failed:', err);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await sqlService.updateUserRole({ userId, channelId, newRole: 2 });
      Alert.alert('Success', 'User promoted to Admin');
      fetchMembers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to promote user');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await sqlService.removeMember({ userId: user.id, channelId, memberId });
      Alert.alert('Member removed');
      fetchMembers();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to remove member');
    }
  };

  const renderItem = ({ item }) => {
    const isOwner = user?.role === 4;
    const isAdmin = user?.role === 3;

    const canPromote = isOwner && item.role === 1;
    const canRemove =
      (isOwner && item.role !== 4) ||
      (isAdmin && item.role === 1);

    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.roleText}>
            {roleLabels[item.role] ?? `Role: ${item.role ?? 'N/A'}`}
          </Text>
        </View>

        <View style={styles.actions}>
          {canPromote && (
            <TouchableOpacity style={styles.actionButton} onPress={() => handleMakeAdmin(item.id)}>
              <Text style={styles.actionText}>Make Admin</Text>
            </TouchableOpacity>
          )}
          {canRemove && (
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveMember(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Channel Settings</Text>
      <Text style={styles.channelId}>Channel ID: <Text style={styles.channelIdValue}>{channelId}</Text></Text>


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
        <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.avatar} />
      )}

      <TouchableOpacity
        style={[styles.fileButton, uploading && { opacity: 0.6 }]}
        onPress={handleChooseImage}
        disabled={uploading}
      >
        <Text style={styles.fileButtonText}>{uploading ? 'Uploading...' : 'Choose Image'}</Text>
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
  actions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  channelId: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  channelIdValue: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

});

export default ChannelSettingsScreen;

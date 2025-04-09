import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import sqlService from '../../services/sqlService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

const categoryMap = {
  personal: 1,
  educational: 2,
  professional: 3
};

const ChannelsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) return;
      const userData = JSON.parse(user);

      const userChannels = await sqlService.getUserChannels(userData.id);
      const filtered = userChannels.filter(c => c.category === categoryMap[category]);
      setChannels(filtered);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setInputValue('');
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', modalType === 'create' ? 'Channel name cannot be empty.' : 'Channel ID cannot be empty.');
      return;
    }

    try {
      const user = await AsyncStorage.getItem('user');
      const userData = JSON.parse(user);

      let response;
      if (modalType === 'create') {
        response = await sqlService.createChannel({
          name: inputValue,
          userId: userData.id,
          role_id: 1,
          category: categoryMap[category]
        });
      } else {
        response = await sqlService.joinChannel({
          userId: userData.id,
          channelId: inputValue
        });
      }

      await fetchChannels();
      Alert.alert('Success', modalType === 'create' ? 'Channel created successfully!' : 'Joined channel successfully!');
    } catch (error) {
      console.error(`${modalType} channel error:`, error);
      Alert.alert('Error', `An error occurred while ${modalType === 'create' ? 'creating' : 'joining'} the channel.`);
    } finally {
      setModalVisible(false);
    }
  };

  const renderChannel = ({ item }) => {
    let imageUri = require('../../assets/math.png');

    if (item.profile_picture) {
      if (typeof item.profile_picture === 'string') {
        imageUri = { uri: item.profile_picture };
      } else if (item.profile_picture.data) {
        const base64Image = Buffer.from(item.profile_picture.data).toString('base64');
        imageUri = { uri: `data:image/jpeg;base64,${base64Image}` };
      }
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
              if (category === 'personal') {
                navigation.navigate('PersonalScreen', {
                  className: item.name,
                  classId: item.id,
                });
              } else if (category === 'professional') {
                navigation.navigate('ProfessionalScreen', {
                  className: item.name,
                  classId: item.id,
                });
              } else {
                navigation.navigate('Class', {
                  className: item.name,
                  classId: item.id,
                });
              }
            }}

      >
        <Image source={imageUri} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.members ? `${item.members} Members` : 'No members yet'}</Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/bizchats_logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Your {category} Channels</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../assets/settings.png')} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading channels...</Text>
      ) : (
        <FlatList
          data={channels}
          renderItem={renderChannel}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={() => openModal('create')}>
          <Text style={styles.buttonText}>+ Create Channel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton} onPress={() => openModal('join')}>
          <Text style={styles.buttonText}>🔗 Join Channel</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalType === 'create' ? 'Create New Channel' : 'Join a Channel'}</Text>
            <TextInput
              style={styles.input}
              placeholder={modalType === 'create' ? 'Enter channel name' : 'Enter channel ID'}
              value={inputValue}
              onChangeText={setInputValue}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{modalType === 'create' ? 'Create' : 'Join'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#007AFF', padding: 15 },
  logo: { width: 170, height: 50, marginRight: 10 },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1 },
  settingsIcon: { width: 24, height: 24 },
  loadingText: { textAlign: 'center', marginTop: 20 },
  list: { padding: 10 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  card: { flex: 1, margin: 5, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', elevation: 5, maxWidth: '47%' },
  image: { width: '100%', height: 100, borderRadius: 10 },
  textContainer: { alignItems: 'center', marginTop: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 10 },
  createButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, flex: 1, marginRight: 10 },
  joinButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, flex: 1 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#999', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
  submitButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, flex: 1 },
});

export default ChannelsScreen;

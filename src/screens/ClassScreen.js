import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTaskBar from '../components/BottomTaskBar';
import sqlService from '../../services/sqlService';

const ClassScreen = ({ route, navigation }) => {
  const { className, classId } = route.params;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        console.log('🔐 Parsed user:', parsedUser);
        setUser(parsedUser);
      }
      fetchAnnouncements();
    };
    init();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await sqlService.getChannelAnnouncements(classId);
      console.log('📣 Announcements response:', res);
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('❌ Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await sqlService.updateAnnouncement({
        id: editingAnnouncement.id,
        title: editTitle,
        content: editContent,
      });
      setModalVisible(false);
      fetchAnnouncements();
    } catch (err) {
      Alert.alert('Error', 'Failed to update announcement.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Announcement', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await sqlService.deleteAnnouncement({ id });
            fetchAnnouncements();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete announcement.');
            console.error(err);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const canEdit = user?.role_id === 1 || user?.role_id === 2;
    const formattedDate = item.creation_date
      ? new Date(item.creation_date).toLocaleString()
      : 'Unknown Date';

    console.log('👤 User Role:', user?.role_id, '→ Can Edit:', canEdit);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.details}>{item.content}</Text>
        </View>
        {canEdit && (
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Text style={styles.actionEdit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.actionDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{className}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChannelSettingsScreen', {
              channelId: classId,
              className,
            })
          }
        >
          <Image source={require('../../assets/settings.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : announcements.length === 0 ? (
        <Text style={styles.noAnnouncements}>No announcements yet.</Text>
      ) : (
        <FlatList
          data={announcements}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Announcement</Text>
            <TextInput
              placeholder="Title"
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              placeholder="Content"
              style={[styles.modalInput, { height: 80 }]}
              multiline
              value={editContent}
              onChangeText={setEditContent}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.modalSaveButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTaskBar
        navigation={navigation}
        currentClassName={className}
        currentClassId={classId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  icon: { width: 24, height: 24, tintColor: '#fff' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardContent: { marginBottom: 10 },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  actionEdit: { color: '#007AFF', fontWeight: 'bold', marginRight: 15 },
  actionDelete: { color: '#FF3B30', fontWeight: 'bold' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  date: { fontSize: 14, color: '#666', marginBottom: 5 },
  details: { fontSize: 13, color: '#444' },
  noAnnouncements: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalSaveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  modalCancelButton: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ClassScreen;

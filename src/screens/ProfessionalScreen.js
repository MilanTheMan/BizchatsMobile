// inside ProfessionalScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import sqlService from '../../services/sqlService';

const tabs = ['Messages', 'Documents', 'Schedule', 'Settings'];

const ProfessionalScreen = ({ route, navigation }) => {
  const { className, classId } = route.params;
  const [activeTab, setActiveTab] = useState('Messages');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (activeTab === 'Settings') {
      navigation.navigate('ChannelSettingsScreen', { channelId: classId });
    } else if (activeTab === 'Schedule') {
      navigation.navigate('ScheduleScreen', { channelId: classId });
    }
  }, [activeTab]);

  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    init();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Messages':
        return <MessagesTab channelId={classId} user={user} />;
      case 'Documents':
        return <DocumentsTab channelId={classId} user={user} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.banner}>
        <Text style={styles.title}>{className}</Text>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>{renderTabContent()}</View>
    </KeyboardAvoidingView>
  );
};

// --- MessagesTab (unchanged) ---

const MessagesTab = ({ channelId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages(channelId);
  }, [channelId]);

  const fetchMessages = async () => {
    try {
      const res = await sqlService.getChannelMessages(channelId);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sqlService.createChannelMessage({
        userId: user.id,
        channelId,
        content: newMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender_name: user.name,
          content: newMessage,
          creation_date: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwn = item.sender_name === user?.name;
    return (
      <View style={[styles.messageWrapper, isOwn ? styles.rightAlign : styles.leftAlign]}>
        <View style={[styles.bubble, isOwn ? styles.myBubble : styles.otherBubble]}>
          {!isOwn && <Text style={styles.senderName}>{item.sender_name}</Text>}
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.time}>
            {new Date(item.creation_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

// --- Documents Tab ---
const DocumentsTab = ({ channelId, user }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) fetchDocuments(selectedCategory.id);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await sqlService.getDocumentCategories(channelId);
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await sqlService.createDocumentCategory({ channelId, categoryName: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const fetchDocuments = async (categoryId) => {
    try {
      const res = await sqlService.getChannelDocuments(channelId, categoryId);
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') setFile(result);
  };

  const handleUpload = async () => {
    if (!file || !selectedCategory) return;
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      });
      const uploadRes = await sqlService.uploadAttachment(formData);

      await sqlService.uploadChannelDocument({
        channelId,
        categoryId: selectedCategory.id,
        userId: user.id,
        fileLink: uploadRes.file_url,
      });

      setFile(null);
      fetchDocuments(selectedCategory.id);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Categories</Text>

      <FlatList
        data={categories}
        numColumns={3}
        key={'3cols'}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => setSelectedCategory(item)}
          >
            <Ionicons name="folder-outline" size={24} color="#007AFF" />
            <Text style={styles.categoryText}>{item.catagory_name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Add Category */}
      <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 16 }}>
        <TextInput
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="New Category"
          style={[styles.input, { flex: 1, marginRight: 10, marginBottom: 0 }]}
        />
        <TouchableOpacity style={styles.sendButton} onPress={createCategory}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {selectedCategory && (
        <>
          <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 10 }}>
            Documents in "{selectedCategory.catagory_name}"
          </Text>
          <FlatList
            data={documents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.docItem}>
                <Text numberOfLines={1} style={{ flex: 1 }}>{item.file_link.split('/').pop()}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(item.file_link)}>
                  <Ionicons name="cloud-download-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity style={styles.uploadButton} onPress={handlePickFile}>
            <Text style={styles.uploadText}>{file ? file.name : 'Choose File'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadButton, { marginTop: 10 }]}
            onPress={handleUpload}
            disabled={!file}
          >
            <Text style={styles.uploadText}>Upload Document</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// --- Styles ---
const BLUE = '#007AFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  banner: {
    backgroundColor: BLUE,
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    backgroundColor: BLUE,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: { flex: 1 },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sendButton: {
    backgroundColor: BLUE,
    padding: 12,
    borderRadius: 12,
  },
  messageWrapper: { marginVertical: 6, flexDirection: 'row' },
  leftAlign: { justifyContent: 'flex-start' },
  rightAlign: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
  },
  myBubble: { backgroundColor: '#fff', borderTopRightRadius: 0 },
  otherBubble: { backgroundColor: BLUE, borderTopLeftRadius: 0 },
  senderName: { fontSize: 12, color: '#e0e0e0', marginBottom: 3 },
  messageText: { fontSize: 16, color: '#000' },
  time: { fontSize: 10, color: '#bbb', textAlign: 'right', marginTop: 4 },
  uploadButton: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  categoryCard: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    color: '#333',
  },
});

export default ProfessionalScreen;

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import sqlService from '../../services/sqlService';

const PersonalScreen = ({ route, navigation }) => {
  const { className, classId } = route.params;
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchMessages(classId);
      }
    };

    init();
  }, [classId]);

  const fetchMessages = async (channelId) => {
    try {
      const res = await sqlService.getChannelMessages(channelId);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch personal messages:', err);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await sqlService.createChannelMessage({
        userId: user.id,
        channelId: classId,
        content: newMessage,
      });

      const newEntry = {
        sender_name: user.name,
        content: newMessage,
        creation_date: new Date().toISOString()
      };

      setMessages((prev) => [...prev, newEntry]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result.type === 'success') {
        const formData = new FormData();
        formData.append('file', {
          uri: result.uri,
          name: result.name,
          type: result.mimeType || 'application/octet-stream',
        });
        formData.append('channelId', classId);

        await sqlService.uploadAttachment(formData);

        Alert.alert('Success', 'Attachment sent!');
      }
    } catch (err) {
      console.error('Attachment error:', err);
      Alert.alert('Error', 'Failed to send attachment');
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }) => {
    const isOwn = item.sender_name === user?.name;
    return (
      <View style={[styles.messageWrapper, isOwn ? styles.rightAlign : styles.leftAlign]}>
        <View style={[styles.bubble, isOwn ? styles.myBubble : styles.otherBubble]}>
          {!isOwn && <Text style={styles.senderName}>{item.sender_name}</Text>}
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.time}>
            {new Date(item.creation_date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{className}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChannelSettingsScreen', { channelId: classId })}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
      />

      <View style={styles.inputWrapper}>
        <TouchableOpacity onPress={handleAttachment} style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const BLUE = '#007AFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF3FF' },

  header: {
    backgroundColor: BLUE,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },

  messageList: {
    padding: 10,
    paddingBottom: 80,
  },

  messageWrapper: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  leftAlign: { justifyContent: 'flex-start' },
  rightAlign: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  myBubble: {
    backgroundColor: '#fff',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: BLUE,
    borderTopLeftRadius: 0,
  },
  senderName: {
    fontSize: 12,
    color: '#e0e0e0',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  time: {
    fontSize: 10,
    color: '#bbb',
    textAlign: 'right',
    marginTop: 4,
  },

  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  attachButton: {
    padding: 8,
    marginRight: 6,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: BLUE,
    marginLeft: 10,
    padding: 12,
    borderRadius: 25,
  },
});

export default PersonalScreen;

import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import sqlService from '../../services/sqlService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { friendId, friendName } = route.params;
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchMessages(parsedUser.id);
    };

    init();
  }, []);

  const fetchMessages = async (userId) => {
    try {
      const allMessages = await sqlService.getChats(userId);
      const filtered = allMessages.data.filter(
        msg =>
          (msg.sender_id === userId && msg.receiver_id === friendId) ||
          (msg.sender_id === friendId && msg.receiver_id === userId)
      );
      setMessages(filtered);
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: user.id,
      receiver_id: friendId,
      content: newMessage
    };

    try {
      await sqlService.createChat(messageData);
      setMessages((prev) => [
        ...prev,
        { ...messageData, creation_date: new Date().toISOString() }
      ]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender_id === user.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.myMessage : styles.friendMessage
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.creation_date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.friendName}>{friendName}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF1F6' },

  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  friendName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },

  messageList: { padding: 15, paddingBottom: 90 },

  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
    marginHorizontal: 10
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  friendMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#000'
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
    marginTop: 4
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    color: '#000'
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20
  }
});

export default ChatScreen;

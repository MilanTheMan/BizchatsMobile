import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import sqlService from '../../services/sqlService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          styles.messageBubble,
          isOwnMessage ? styles.myMessage : styles.friendMessage
        ]}
      >
        <Text style={styles.messageSender}>
          {isOwnMessage ? 'You' : friendName}
        </Text>
        <Text style={styles.messageText}>{item.content}</Text>
        {item.creation_date && (
          <Text style={styles.messageTime}>
            {new Date(item.creation_date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={scrollToBottom}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  messageList: { padding: 10, paddingBottom: 60 },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 6
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  friendMessage: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
    textAlign: 'right'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    color: '#000'
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default ChatScreen;

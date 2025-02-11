import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const GeneralChatScreen = ({ route }) => {
  const { className } = route.params || { className: 'General Chat' }; // Get class name

  const [messages, setMessages] = useState([
    { id: '1', text: `Welcome to ${className} Chat!`, sender: 'system' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim().length === 0) return;

    setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'me' }]);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{className} Chat</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.friendMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header styling
  header: {
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
  },
  headerText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },

  // Message styles
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  friendMessage: { alignSelf: 'flex-start', backgroundColor: '#ddd' },
  messageText: { fontSize: 16, color: '#fff' },

  // Input section
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ccc' },
  sendButton: { backgroundColor: '#007AFF', padding: 10, marginLeft: 10, borderRadius: 5 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

export default GeneralChatScreen;
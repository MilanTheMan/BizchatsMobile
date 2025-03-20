import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import sqlService from '../../services/sqlService';

const ChatScreen = ({ route, navigation }) => {
  const { friendId, friendName } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(`📡 Fetching messages for chat with ${friendId}`);
        const response = await sqlService.getMessages(friendId);
        setMessages(response.data || []);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [friendId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = { friendId, text: newMessage, sender: 'me' };

    try {
      await sqlService.sendMessage(messageData);
      setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'me' }]);
      setNewMessage('');
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{friendName}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.friendMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
      )}

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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', padding: 15 },
  backButton: { fontSize: 20, color: '#fff', marginRight: 10 },
  headerText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  loader: { marginTop: 20 },
  messageContainer: { maxWidth: '75%', padding: 10, marginVertical: 5, borderRadius: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  friendMessage: { alignSelf: 'flex-start', backgroundColor: '#ddd' },
  messageText: { fontSize: 16, color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 5, borderColor: '#ccc' },
  sendButton: { backgroundColor: '#007AFF', padding: 10, marginLeft: 10, borderRadius: 5 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatScreen;

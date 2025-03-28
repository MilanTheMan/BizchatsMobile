import React, { useEffect, useState } from 'react';
import { View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import sqlService from '../../services/sqlService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // 👈 This tracks screen focus

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchFriends(parsedUser.id);
    };

    if (isFocused) {
      init();
    }
  }, [isFocused]); // 👈 Triggers when screen is re-focused

  const fetchFriends = async (userId) => {
    try {
      const response = await sqlService.getFriends(userId);
      const friendList = Array.isArray(response)
        ? response
        : response?.data || [];
      setFriends(friendList);
    } catch (error) {
      console.error("❌ Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleSearch = async () => {
    const numericId = parseInt(searchId);
    if (isNaN(numericId)) {
      Alert.alert("Please enter a valid numeric User ID.");
      return;
    }

    try {
      const response = await sqlService.getUserById(numericId);
      if (response?.data?.length > 0) {
        setSearchResult(response.data[0]);
      } else {
        Alert.alert("User not found");
      }
    } catch (error) {
      console.error("❌ Error searching user:", error);
      Alert.alert("Error searching user");
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await sqlService.addFriend({ user_id: user.id, friend_id: friendId });
      setFriends([...friends, searchResult]);
      setSearchResult(null);
      Alert.alert("Friend added successfully");
    } catch (error) {
      console.error("❌ Error adding friend:", error);
      Alert.alert("Failed to add friend");
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      await sqlService.deleteFriend({ user_id: user.id, friend_id: friendId });
      setFriends(friends.filter(friend => friend.id !== friendId));
      Alert.alert("Friend removed");
    } catch (error) {
      console.error("❌ Error removing friend:", error);
      Alert.alert("Failed to remove friend");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Friends</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          value={searchId}
          onChangeText={setSearchId}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Result */}
      {searchResult && (
        <View style={styles.searchResult}>
          <Text>{searchResult.name} ({searchResult.email})</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(searchResult.id)}>
            <Text style={styles.addText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Friends List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : friends.length === 0 ? (
        <Text style={styles.emptyText}>You have no friends yet.</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.profilePicture || 'https://via.placeholder.com/50' }}
                style={styles.profilePicture}
              />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.status}>{item.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('ChatScreen', { friendId: item.id, friendName: item.name })}
              >
                <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleDeleteFriend(item.id)}
              >
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  searchContainer: { flexDirection: 'row', marginVertical: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  searchButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, marginLeft: 10 },
  searchText: { color: '#fff', fontWeight: 'bold' },
  searchResult: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 10, backgroundColor: '#fff', borderRadius: 10, marginVertical: 5
  },
  addButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  addText: { color: '#fff', fontWeight: 'bold' },
  loader: { marginTop: 20 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10,
    padding: 15, marginVertical: 5, alignItems: 'center'
  },
  profilePicture: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 14, color: '#666' },
  chatButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, marginRight: 5 },
  removeButton: { backgroundColor: '#d9534f', padding: 10, borderRadius: 5 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 },
});

export default FriendsScreen;

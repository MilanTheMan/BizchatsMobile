import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import sqlService from '../../services/sqlService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendsScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
  }, [isFocused]);

  const fetchFriends = async (userId) => {
    try {
      const response = await sqlService.getFriends(userId);
      const friendList = Array.isArray(response) ? response : response?.data || [];

      // Filter duplicates by id
      const uniqueFriends = friendList.filter(
        (friend, index, self) =>
          index === self.findIndex((f) => f.id === friend.id)
      );

      setFriends(uniqueFriends);
    } catch (error) {
      console.error("❌ Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const response = await sqlService.getAllUsers();
      const filtered = response?.data?.filter(
        (userItem) =>
          userItem.name?.toLowerCase().includes(searchInput.toLowerCase()) &&
          userItem.id !== user?.id
      );

      setSearchResults(filtered);
    } catch (error) {
      console.error("❌ Error during search:", error);
      Alert.alert("Search failed");
    }
  };

  const handleAddFriend = async (friendId) => {
    if (friends.some((f) => f.id === friendId)) {
      Alert.alert("You're already friends with this user.");
      return;
    }

    try {
      await sqlService.addFriend({ user_id: user.id, friend_id: friendId });
      const addedFriend = searchResults.find((u) => u.id === friendId);
      if (addedFriend) setFriends((prev) => [...prev, addedFriend]);
      Alert.alert("Friend added successfully");
    } catch (error) {
      console.error("❌ Error adding friend:", error);
      Alert.alert("Failed to add friend");
    }
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendCard}>
      <View>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() =>
          navigation.navigate('ChatScreen', { friendId: item.id, friendName: item.name })
        }
      >
        <Text style={{ color: 'white' }}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* 🔍 Search Results */}
      {searchResults.length > 0 && (
        <>
          <Text style={styles.subHeader}>Search Results</Text>
          {searchResults.map((result) => (
            <View key={result.id} style={styles.friendCard}>
              <View>
                <Text style={styles.friendName}>{result.name}</Text>
                <Text style={styles.friendEmail}>{result.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddFriend(result.id)}
              >
                <Text style={{ color: '#fff' }}>Add Friend</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* 🧑‍🤝‍🧑 Friend List */}
      <Text style={styles.subHeader}>Your Friends</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 10 }} />
      ) : friends.length === 0 ? (
        <Text style={styles.noFriends}>You have no friends yet.</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFriendItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 15 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  friendName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  friendEmail: {
    fontSize: 13,
    color: '#555',
  },
  chatButton: {
    backgroundColor: 'green',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  noFriends: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
});

export default FriendsScreen;

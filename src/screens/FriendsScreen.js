import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const friendsData = [
  {
    id: '1',
    name: 'Milan',
    status: 'Online',
    profilePicture: require('../../assets/MilanProfile.png'),
  },
  {
    id: '2',
    name: 'Fahad',
    status: 'Offline',
    profilePicture: require('../../assets/FahadProfile.jpg'),
  },
  {
    id: '3',
    name: 'Daniel',
    status: 'Idle',
    profilePicture: require('../../assets/MilanProfile.png'),
  },
  {
    id: '4',
    name: 'Lara',
    status: 'Online',
    profilePicture: require('../../assets/FahadProfile.jpg'),
  },
  {
    id: '5',
    name: 'Alexis',
    status: 'Offline',
    profilePicture: require('../../assets/MilanProfile.png'),
  },
];

const FriendsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Green Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Friends List</Text>
      </View>

      {/* Friend List */}
      <FlatList
        data={friendsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.profilePicture} style={styles.profilePicture} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('ChatScreen', { friendName: item.name })}
            >
              <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header Styling
  header: {
    backgroundColor: '#34A853',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },

  // Card Styling
  card: {
    flexDirection: 'row',
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
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  status: { fontSize: 14, color: '#666' },

  // Chat Button Styling
  chatButton: {
    backgroundColor: '#34A853',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendsScreen;
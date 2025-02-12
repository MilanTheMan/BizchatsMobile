import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';

const PersonalScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const channels = [
    { id: '1', name: 'Ω Omega', members: '250 Members', image: require('../../assets/omegabanner.png') },
    { id: '2', name: 'The Boys', members: '33 Boys', image: require('../../assets/mountain.png') },
    { id: '3', name: 'Torontonians', members: '11056 Students', image: require('../../assets/toronto.png') },
  ];

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChannel = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.members}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/bizchats_logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Welcome to BizChats</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../assets/settings.png')} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>Your Channels:</Text>
      </View>
      <FlatList
        data={filteredChannels}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search for channels..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
  },
  logo: { width: 170, height: 50, marginRight: 10 },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1 },
  settingsIcon: { width: 24, height: 24 },
  noteContainer: { marginVertical: 10, paddingHorizontal: 15 },
  noteText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  list: { padding: 10 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    maxWidth: '47%',
  },
  image: { width: '100%', height: 100, borderRadius: 10 },
  textContainer: { alignItems: 'center', marginTop: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555' },
  searchBar: {
    position: 'absolute',
    bottom: 10,
    left: '5%',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    elevation: 5,
  },
});

export default PersonalScreen;
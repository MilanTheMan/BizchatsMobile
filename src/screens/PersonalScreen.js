import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const PersonalScreen = ({ navigation }) => {
  const classes = [
    { id: '1', name: 'Ω Omega', members: '250 Members', image: require('../../assets/omegabanner.png') },
    { id: '2', name: 'The Boys', members: '33 Boys', image: require('../../assets/mountain.png') },
    { id: '3', name: 'Torontonians', members: '11056 Students', image: require('../../assets/toronto.png') },
  ];

  const renderClass = (item) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.members}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/bizchats_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Welcome to BizChats</Text>
        <Image
          source={require('../../assets/profile_icon.png')}
          style={styles.profileIcon}
        />
      </View>

      {/* Title Section */}
      <Text style={styles.sectionTitle}>Your Classes:</Text>

      {/* Class List */}
      <View style={styles.classesContainer}>
        {classes.map(renderClass)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header Styling
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  logo: { width: 120, height: 40 },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  profileIcon: { width: 40, height: 40 },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 15,
    textAlign: 'center',
  },

  // Classes Container
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  card: {
    width: '45%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 100, borderRadius: 10 },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default PersonalScreen;

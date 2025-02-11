import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ProfessionalScreen = ({ navigation }) => {
  const businesses = [
    { id: '1', name: 'Chesstopia', members: '142 Employees', image: require('../../assets/chess.png') },
    { id: '2', name: 'Freelance Group', members: '13 Members', image: require('../../assets/workplace.png') },
  ];

  const renderBusiness = (item) => (
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
      <Text style={styles.sectionTitle}>Your Businesses:</Text>

      {/* Business List */}
      <View style={styles.businessesContainer}>
        {businesses.map(renderBusiness)}
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

  // Businesses Container
  businessesContainer: {
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

export default ProfessionalScreen;
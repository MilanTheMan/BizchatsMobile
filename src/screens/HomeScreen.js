import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/bizchats_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Welcome to BizChats</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('../../assets/profile_icon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <Text style={styles.sectionTitle}>How will you use BizChats?</Text>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PersonalScreen')}
        >
          <Image
            source={require('../../assets/personal.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Personal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EducationalScreen')}
        >
          <Image
            source={require('../../assets/educational.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Educational</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ProfessionalScreen')}
        >
          <Image
            source={require('../../assets/professional.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Professional</Text>
        </TouchableOpacity>
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

  // Categories Container
  categoriesContainer: {
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
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: { width: 60, height: 60, marginBottom: 10 },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default HomeScreen;
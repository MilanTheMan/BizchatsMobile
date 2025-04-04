import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BottomTaskBar from '../components/BottomTaskBar';

const ClassScreen = ({ route, navigation }) => {
  const { className, classId } = route.params;

  const items = [
    {
      id: '1',
      title: 'Assignment two has been posted',
      date: 'Nov 10th 2024',
      details: 'Due: Nov 29th 2024  Weight: 20%',
      icon: require('../../assets/assignments.png'),
    },
    {
      id: '2',
      title: 'Marks for Assignment One have been assigned',
      date: 'Nov 5th 2024',
      details: 'Marks',
      icon: require('../../assets/marks.png'),
    },
    {
      id: '3',
      title: 'Lab class for Nov 2nd will be held online',
      date: 'Nov 1st 2024',
      details: 'Announcement',
      icon: require('../../assets/meeting.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{className} Grades</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChannelSettingsScreen', { channelId: classId, className })}>
          <Image source={require('../../assets/settings.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Class Content */}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.icon} style={styles.cardIcon} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.details}>{item.details}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* ✅ Bottom Taskbar */}
      <BottomTaskBar
        navigation={navigation}
        currentClassName={className}
        currentClassId={classId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header Styling
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  settingsIcon: { padding: 5 },
  icon: { width: 24, height: 24, tintColor: '#fff' },

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
  cardIcon: { width: 50, height: 50, marginRight: 15, tintColor: '#007AFF' },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  date: { fontSize: 14, color: '#666', marginBottom: 5 },
  details: { fontSize: 13, color: '#999' },
});

export default ClassScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import sqlService from '../../services/sqlService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GradesScreen = ({ route }) => {
  const { className, channelId } = route.params;

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, [channelId]);

  const fetchGrades = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('user');
      const parsedUser = JSON.parse(currentUser);

      const [assignmentsRes, marksRes] = await Promise.all([
        sqlService.getChannelAssignments(channelId),
        sqlService.getChannelMarks(channelId),
      ]);

      const allAssignments = assignmentsRes.data || [];
      const allMarks = marksRes.data || [];

      const currentUserMarks = allMarks.filter(
        (m) => m.user_id === parsedUser.id
      );

      const combined = allAssignments.map((assignment) => {
        const matched = currentUserMarks.find(
          (mark) => mark.assignment_id === assignment.id
        );
        return {
          assignment_title: assignment.title,
          mark: matched?.mark ?? null,
        };
      });

      setGrades(combined);
    } catch (err) {
      console.error('❌ Failed to fetch grades:', err);
      Alert.alert('Error', 'Unable to load grades');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isSubmitted = item.mark !== null;
    return (
      <View style={styles.card}>
        <Text style={styles.assignmentTitle}>{item.assignment_title}</Text>
        <Text
          style={[
            styles.grade,
            { color: isSubmitted ? '#007AFF' : '#FF3B30' },
          ]}
        >
          {isSubmitted ? `Grade: ${item.mark}` : 'Not Submitted'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{className} Grades</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={grades}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.assignment_title + index}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No grades available</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  card: {
    backgroundColor: '#e6edff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  assignmentTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  grade: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

export default GradesScreen;

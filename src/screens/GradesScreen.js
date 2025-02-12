import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const classGrades = {
  Math: [
    { id: '1', title: 'Quiz 1', grade: 'A' },
    { id: '2', title: 'Assignment 1', grade: 'B+' },
    { id: '3', title: 'Group Project', grade: 'A-' },
  ],
  Science: [
    { id: '4', title: 'Quiz 1', grade: 'B' },
    { id: '5', title: 'Lab Report', grade: 'A+' },
    { id: '6', title: 'Final Exam', grade: 'B-' },
  ],
  Design: [
    { id: '7', title: 'Sketching Task', grade: 'C+' },
    { id: '8', title: '3D Model Project', grade: 'B' },
    { id: '9', title: 'Final Portfolio', grade: 'A' },
  ],
};

const GradesScreen = ({ route }) => {
  const { className = 'Math' } = route.params || {}; // Default to Math if no class selected
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    setGrades(classGrades[className] || []);
  }, [className]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{className} Grades</Text>
      </View>

      {/* Grades List */}
      <FlatList
        data={grades}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.grade}>Grade: {item.grade}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No grades available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    backgroundColor: '#34A853',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },

  card: {
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
  },
  cardContent: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  grade: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 },
});

export default GradesScreen;
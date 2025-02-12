import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AssignmentsScreen = ({ route }) => {
  const { className = 'General' } = route.params || {};
  const formattedClassName = className.includes('Class') ? className : `${className} Class`;

  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState('');
  const [dueDate, setDueDate] = useState('');

  // ✅ Load assignments from AsyncStorage when screen opens
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const storedData = await AsyncStorage.getItem(`assignments_${className}`);
      if (storedData) {
        setAssignments(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const saveAssignments = async (updatedAssignments) => {
    try {
      await AsyncStorage.setItem(`assignments_${className}`, JSON.stringify(updatedAssignments));
    } catch (error) {
      console.error('Failed to save assignments:', error);
    }
  };

  const addAssignment = () => {
    if (!newAssignment.trim()) {
      Alert.alert('Error', 'Assignment title cannot be empty');
      return;
    }
    if (!dueDate.trim()) {
      Alert.alert('Error', 'Due date cannot be empty');
      return;
    }

    const newEntry = {
      id: (assignments.length + 1).toString(),
      title: newAssignment,
      dueDate: dueDate,
    };

    const updatedAssignments = [...assignments, newEntry];
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);

    setNewAssignment('');
    setDueDate('');
    Alert.alert('Success', 'Assignment added successfully!');
  };

  // ✅ Delete an assignment
  const deleteAssignment = (id) => {
    const updatedAssignments = assignments.filter((item) => item.id !== id);
    setAssignments(updatedAssignments);
    saveAssignments(updatedAssignments);
    Alert.alert('Deleted', 'Assignment removed successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formattedClassName} Assignments</Text>

      {/* Assignments List */}
      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.assignmentItem}>
            <View style={styles.assignmentText}>
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
            </View>
            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAssignment(item.id)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No assignments available.</Text>}
      />

      {/* Add New Assignment Section */}
      <TextInput
        style={styles.input}
        placeholder="Enter Assignment Title"
        value={newAssignment}
        onChangeText={setNewAssignment}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Due Date (e.g., Feb 15, 2025)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Add Assignment" onPress={addAssignment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  assignmentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assignmentText: { flex: 1 },
  assignmentTitle: { fontSize: 18, fontWeight: 'bold' },
  dueDate: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 20 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AssignmentsScreen;
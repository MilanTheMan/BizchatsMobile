import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import sqlService from '../../services/sqlService';

const AssignmentsScreen = ({ route }) => {
  const { channelId, className } = route.params;

  const [assignments, setAssignments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channelId) {
      console.log('📡 Fetching assignments for channel:', channelId);
      fetchAssignments();
    }
  }, [channelId]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await sqlService.getChannelAssignments(channelId);
      console.log('📥 Raw assignments from backend:', res.data);
      setAssignments(res.data || []);
    } catch (err) {
      console.error('❌ Failed to load assignments:', err);
      Alert.alert('Error', 'Could not load assignments');
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!comment && !file) {
      Alert.alert('Empty Submission', 'Please enter a comment or upload a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('comment', comment);
      if (file) {
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });
      }

      await sqlService.submitAssignment(formData);
      Alert.alert('Success', 'Assignment submitted!');
      setComment('');
      setFile(null);
      setExpandedId(null);
    } catch (err) {
      console.error('❌ Failed to submit assignment:', err);
      Alert.alert('Error', 'Could not submit assignment');
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const formattedDueDate = item.due_date
      ? new Date(item.due_date).toLocaleString()
      : 'No due date';
    const formattedCreatedDate = item.creation_date
      ? new Date(item.creation_date).toLocaleString()
      : '';

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.assignmentTitle}>{item.title}</Text>
          <Text style={styles.assignmentDesc}>{item.description}</Text>
          <Text style={styles.assignmentDue}>Due: {formattedDueDate}</Text>
          <Text style={styles.assignmentCreated}>Posted: {formattedCreatedDate}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.submissionSection}>
            <TextInput
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
              style={styles.input}
              multiline
            />
            <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
              <Text style={styles.fileButtonText}>
                {file ? file.name : 'Choose File'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleSubmitAssignment(item.id)}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{className} Assignments</Text>

      {!channelId ? (
        <Text style={styles.error}>❌ Missing channelId. Cannot load assignments.</Text>
      ) : loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No assignments available.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  card: {
    backgroundColor: '#e6edff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  assignmentDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  assignmentDue: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 2,
  },
  assignmentCreated: {
    fontSize: 13,
    color: '#007AFF',
  },
  submissionSection: { marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 60,
  },
  fileButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  fileButtonText: { color: '#333' },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: 'bold' },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontStyle: 'italic',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssignmentsScreen;

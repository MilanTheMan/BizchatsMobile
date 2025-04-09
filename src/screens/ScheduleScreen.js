import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import sqlService from '../../services/sqlService';

const ProfessionalScheduleScreen = ({ route, navigation }) => {
  const { channelId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });

  const formattedDate = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await sqlService.getChannelEvents(channelId);
      const formatted = (res.data || []).map(e => ({
        ...e,
        event_date: new Date(e.event_date).toISOString().split('T')[0],
      }));
      setEvents(formatted);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const createEvent = async () => {
    if (!newEvent.title.trim()) return;
    try {
      await sqlService.createChannelEvent({
        channelId,
        title: newEvent.title,
        description: newEvent.description,
        event_date: formattedDate,
      });
      setNewEvent({ title: '', description: '' });
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await sqlService.deleteChannelEvent({ eventId });
      fetchEvents();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const dayEvents = events.filter(e => e.event_date === formattedDate);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Schedule</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(new Date(day.dateString))}
        markedDates={{ [formattedDate]: { selected: true, selectedColor: '#007AFF' } }}
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.sectionTitle}>Create New Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={newEvent.title}
        onChangeText={text => setNewEvent(prev => ({ ...prev, title: text }))}
      />
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Event Description"
        multiline
        value={newEvent.description}
        onChangeText={text => setNewEvent(prev => ({ ...prev, description: text }))}
      />
      <TouchableOpacity style={styles.button} onPress={createEvent}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Events on {formattedDate}</Text>
      {dayEvents.length > 0 ? (
        dayEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>{event.description}</Text>
            <TouchableOpacity onPress={() => deleteEvent(event.id)} style={styles.trashIcon}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={{ color: '#888' }}>No events for this date.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFC',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ProfessionalScheduleScreen;

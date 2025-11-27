import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import eventsData from '../data/events.json';

type Event = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
};

const AgendaScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(1)).current;

  const markedDates = eventsData.reduce((acc: any, event: Event) => {
    acc[event.date] = {
      marked: true,
      dotColor: '#1F6FB2',
      selected: event.date === selectedDate,
      selectedColor: '#1F6FB2',
    };
    return acc;
  }, {});

  const eventsForSelected = selectedDate
    ? eventsData.filter((e) => e.date === selectedDate)
    : [];

  useEffect(() => {
    if (!selectedDate) return;
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selectedDate, opacity]);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#E6F7D9',
          calendarBackground: '#E6F7D9',
          selectedDayBackgroundColor: '#1F6FB2',
          todayTextColor: '#D84343',
          dayTextColor: '#123028',
          arrowColor: '#1F6FB2',
          monthTextColor: '#123028',
        }}
      />
      <Animated.View style={[styles.listContainer, { opacity }]}>
        <Text style={styles.header}>
          Agenda {selectedDate ?? '(pilih tanggal)'}
        </Text>
        <FlatList
          data={eventsForSelected}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.eventItem}>• {item.title}</Text>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Belum ada kegiatan pada tanggal ini.
            </Text>
          }
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F7D9' },
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3FFEE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#123028',
  },
  eventItem: { fontSize: 14, marginBottom: 4, color: '#234A38' },
  empty: { fontSize: 14, color: '#7A9585' },
});

export default AgendaScreen;

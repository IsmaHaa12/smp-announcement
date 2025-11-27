import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AnnouncementCard from '../components/AnnouncementCard';
import announcementsData from '../data/announcements.json';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pengumuman Terbaru</Text>
      <FlatList
        data={announcementsData.slice(0, 3)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnnouncementCard
            title={item.title}
            date={item.date}
            category={item.category}
            content={item.content}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#E6F7D9' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#123028',
  },
});

export default HomeScreen;

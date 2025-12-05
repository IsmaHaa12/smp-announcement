import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnnouncementCard from '../components/AnnouncementCard';
import defaultAnnouncements from '../data/announcements.json';

type Announcement = {
  id: string;
  title: string;
  date: string;
  category: string;
  content?: string;
};

const STORAGE_KEY = 'announcements';

const HomeScreen = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAnnouncements(JSON.parse(stored));
        } else {
          setAnnouncements(defaultAnnouncements as Announcement[]);
        }
      } catch (e) {
        console.log('Error loading announcements for home', e);
        setAnnouncements(defaultAnnouncements as Announcement[]);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pengumuman</Text>
      <FlatList
        data={announcements}
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
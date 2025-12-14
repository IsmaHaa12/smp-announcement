import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AnnouncementCard from '../components/AnnouncementCard';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

type Announcement = {
  id: string;
  title: string;
  date: string;
  category: string;
  content?: string;
};

const HomeScreen = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'announcements'),
      orderBy('date', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items: Announcement[] = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        date: d.data().date,
        category: d.data().category,
        content: d.data().content,
      }));
      setAnnouncements(items);
    });

    return () => unsub();
  }, []);

  const latest = announcements;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pengumuman</Text>
      <FlatList
        data={latest}
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
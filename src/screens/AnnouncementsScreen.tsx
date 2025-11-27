import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import AnnouncementCard from '../components/AnnouncementCard';
import announcementsData from '../data/announcements.json';

const AnnouncementsScreen = () => {
  const [search, setSearch] = useState('');

  const filtered = announcementsData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Cari pengumuman..."
        placeholderTextColor="#7A9585"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
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
  search: {
    backgroundColor: '#ffffffcc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B7D9A8',
    color: '#123028',
  },
});

export default AnnouncementsScreen;

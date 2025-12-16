import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnnouncementCard from '../components/AnnouncementCard';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

type Announcement = {
  id: string;
  title: string;
  date: string;      // "YYYY-MM-DD HH:mm" atau "YYYY-MM-DD"
  category: string;
  content?: string;
};

type Event = {
  id: string;
  title: string;
  date: string;      // "YYYY-MM-DD"
};

const HomeScreen = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // animasi untuk blok agenda (naik-turun halus)
  const agendaOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Listener pengumuman (terbaru duluan)
    const q1 = query(
      collection(db, 'announcements'),
      orderBy('date', 'desc')
    );
    const unsub1 = onSnapshot(q1, (snapshot) => {
      const items: Announcement[] = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        date: d.data().date,
        category: d.data().category,
        content: d.data().content,
      }));
      setAnnouncements(items);
    });

    const q2 = query(
      collection(db, 'events'),
      orderBy('date', 'desc')
    );
    const unsub2 = onSnapshot(q2, (snapshot) => {
      const items: Event[] = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        date: d.data().date,
      }));
      setEvents(items);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(agendaOffset, {
          toValue: -4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(agendaOffset, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [agendaOffset]);

  const latestAnnouncements = announcements.slice(0, 5);
  const latestEvents = events.slice(0, 3); // 3 agenda terbaru

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#3C8D3F', '#1F6FB2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.schoolName}>SMP N 2 Ayah</Text>
        <Text style={styles.subtitle}>Pengumuman & Agenda Sekolah</Text>
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Pengumuman</Text>
            <Text style={styles.chipValue}>{announcements.length}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipLabel}>Agenda</Text>
            <Text style={styles.chipValue}>{events.length}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Pengumuman terbaru</Text>
        <Text style={styles.sectionDesc}>
          Menampilkan {latestAnnouncements.length} pengumuman terakhir.
        </Text>

        <FlatList
          data={latestAnnouncements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 4 }}
          renderItem={({ item }) => (
            <AnnouncementCard
              title={item.title}
              date={item.date}
              category={item.category}
              content={item.content}
            />
          )}
        />

        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>
          Agenda terbaru
        </Text>
        <Text style={styles.sectionDesc}>
          3 agenda sekolah terbaru.
        </Text>

        <Animated.View style={{ transform: [{ translateY: agendaOffset }] }}>
          {latestEvents.length === 0 ? (
            <Text style={styles.noEventText}>
              Belum ada agenda yang terjadwal.
            </Text>
          ) : (
            latestEvents.map((ev) => (
              <View key={ev.id} style={styles.eventRow}>
                <View style={styles.eventDot} />
                <View style={styles.eventTextRow}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {ev.title}
                  </Text>
                  <Text style={styles.eventDateInline}>{ev.date}</Text>
                </View>
              </View>
            ))
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E6F7D9',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  schoolName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#E1F5E9',
    fontSize: 14,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  chip: {
    backgroundColor: '#FFFFFF22',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipLabel: {
    color: '#F3FFEE',
    fontSize: 12,
    marginRight: 6,
  },
  chipValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: '#F3FFEE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#123028',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#5C7A6A',
    marginTop: 2,
  },
  noEventText: {
    fontSize: 13,
    color: '#7A9585',
    marginTop: 6,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1F6FB2',
    marginRight: 8,
  },
  eventTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    color: '#234A38',
    fontWeight: '500',
    flexShrink: 1,
  },
  eventDateInline: {
    fontSize: 12,
    color: '#5C7A6A',
    marginLeft: 8,
  },
});

export default HomeScreen;

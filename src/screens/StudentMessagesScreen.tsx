// src/screens/StudentMessagesScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AuthContext } from '../../App';
import { Timestamp } from 'firebase/firestore';

type StudentMessage = {
  id: string;
  title: string;
  body: string;
  createdAt?: Timestamp;
};

const StudentMessagesScreen = () => {
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authCtx?.user || !authCtx.user.email) {
      setLoading(false);
      return;
    }

    const email = authCtx.user.email.toLowerCase();

    const q = query(
      collection(db, 'studentMessages'),
      where('studentEmail', '==', email),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      snap => {
        const items: StudentMessage[] = snap.docs.map(d => ({
          id: d.id,
          title: d.data().title,
          body: d.data().body,
          createdAt: d.data().createdAt,
        }));
        setMessages(items);
        setLoading(false);
      },
      err => {
        console.log('studentMessages error:', err);
        setLoading(false);
      }
    );

    return unsub;
  }, [authCtx?.user]);

  if (!authCtx?.user) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Silakan login sebagai siswa untuk melihat pesan.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1F6FB2" />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Belum ada pesan untuk akun siswa ini.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesan untuk Anda</Text>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.msgTitle}>{item.title}</Text>
            <Text style={styles.msgBody}>{item.body}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F7D9', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E6F7D9' },
  title: { fontSize: 18, fontWeight: '600', color: '#123028', marginBottom: 8 },
  info: { fontSize: 14, color: '#234A38', textAlign: 'center', paddingHorizontal: 24 },
  card: {
    backgroundColor: '#F3FFEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  msgTitle: { fontSize: 15, fontWeight: '600', color: '#123028', marginBottom: 4 },
  msgBody: { fontSize: 13, color: '#234A38' },
});

export default StudentMessagesScreen;
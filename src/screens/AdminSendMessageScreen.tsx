// src/screens/AdminSendMessageScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AuthContext } from '../../App';

type Student = {
  id: string;      // document id / uid
  email: string;
};

const AdminSendMessageScreen = () => {
  const auth = useContext(AuthContext);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  // OPSIONAL: kalau kamu punya koleksi "users" berisi semua siswa, bisa load di sini
  // kalau belum punya, nanti pemilihan siswa bisa pakai input manual userId saja.
  useEffect(() => {
    // contoh kalau kamu sudah punya koleksi "users" dengan field role: "student"

    const loadStudents = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const snap = await getDocs(q);
        const items: Student[] = snap.docs.map(d => ({
          id: d.id,
          email: d.data().email,
        }));
        setStudents(items);
      } catch (e) {
        console.log('loadStudents error', e);
      }
    };

    loadStudents();
  }, []);

  const handleSend = async () => {
    if (!auth?.isAdmin) {
      Alert.alert('Tidak diizinkan', 'Hanya admin yang bisa mengirim pesan.');
      return;
    }
    if (!selectedEmail || !title || !body) {
      Alert.alert('Lengkapi data', 'Pilih siswa dan isi judul serta isi pesan.');
      return;
    }

    try {
      setLoading(true);

      const uq = query(collection(db, 'users'), where('email', '==', selectedEmail));
      const usnap = await getDocs(uq);
      if (usnap.empty) {
        Alert.alert('Gagal', 'Email siswa tidak ditemukan di koleksi users.');
        setLoading(false);
        return;
      }
      const userDoc = usnap.docs[0];
      const userId = userDoc.id;

      await addDoc(collection(db, 'studentMessages'), {
        userId,
        title,
        body,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sukses', 'Pesan berhasil dikirim ke siswa.');
      setTitle('');
      setBody('');
    } catch (e) {
      console.log('send message error', e);
      Alert.alert('Error', 'Gagal mengirim pesan.');
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>Hanya admin yang dapat mengirim pesan siswa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirim Pesan ke Siswa</Text>

      <Text style={styles.label}>Email siswa</Text>
      <TextInput
        style={styles.input}
        placeholder="mis. siswa1@smp2ayah.sch.id"
        value={selectedEmail}
        onChangeText={setSelectedEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        placeholder="Judul pesan"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Isi pesan</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Tulis pesan untuk siswa..."
        value={body}
        onChangeText={setBody}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSend}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Mengirim...' : 'Kirim Pesan'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F7D9', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E6F7D9' },
  info: { fontSize: 14, color: '#234A38', textAlign: 'center', paddingHorizontal: 24 },
  title: { fontSize: 18, fontWeight: '600', color: '#123028', marginBottom: 16 },
  label: { fontSize: 13, color: '#234A38', marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B7D9A8',
    color: '#123028',
  },
  button: {
    backgroundColor: '#1F6FB2',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default AdminSendMessageScreen;
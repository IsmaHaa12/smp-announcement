import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AuthContext } from '../../App';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AdminLoginScreen = () => {
  const auth = useContext(AuthContext);
  const [adminPassword, setAdminPassword] = useState('');

  // form kirim pesan siswa
  const [studentEmail, setStudentEmail] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleLogin = async () => {
    if (!auth) return;
    // di Welcome admin login pakai email, di sini cukup password saja
    const ok = await auth.loginAsAdmin('admin@smp2ayah.sch.id', adminPassword);
    if (!ok) {
      Alert.alert('Gagal', 'Password admin salah');
    } else {
      setAdminPassword('');
      Alert.alert('Sukses', 'Anda login sebagai admin');
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await auth.logout();
    Alert.alert('Logout', 'Anda keluar dari mode admin');
  };

  const handleSendMessage = async () => {
    if (!auth?.isAdmin) {
      Alert.alert('Tidak diizinkan', 'Hanya admin yang dapat mengirim pesan.');
      return;
    }
    if (!studentEmail || !title || !body) {
      Alert.alert('Lengkapi data', 'Isi email siswa, judul, dan isi pesan.');
      return;
    }

    try {
      setSending(true);

      // versi simple: simpan email siswa di dokumen, dan di StudentMessagesScreen
      // query pakai field "studentEmail" bukan userId
      await addDoc(collection(db, 'studentMessages'), {
        studentEmail: studentEmail.trim().toLowerCase(),
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
      setSending(false);
    }
  };

  // Kalau admin sudah login → tampilkan panel admin + kirim pesan
  if (auth?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mode Admin Aktif</Text>
        <Text style={styles.text}>
          Anda dapat mengubah data serta mengirim pesan khusus untuk siswa.
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout Admin</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.subTitle}>Kirim Pesan ke Siswa</Text>

        <Text style={styles.label}>Email siswa</Text>
        <TextInput
          style={styles.input}
          placeholder="mis. siswa1@smp2ayah.sch.id"
          value={studentEmail}
          onChangeText={setStudentEmail}
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
          style={[styles.button, sending && { opacity: 0.6 }]}
          onPress={handleSendMessage}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? 'Mengirim...' : 'Kirim Pesan'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Kalau belum login admin → form login admin seperti biasa
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Admin</Text>
      <Text style={styles.text}>
        Masukkan password khusus admin untuk mengelola data dan pesan siswa.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Password admin"
        secureTextEntry
        value={adminPassword}
        onChangeText={setAdminPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F7D9', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#123028', marginBottom: 8 },
  subTitle: { fontSize: 16, fontWeight: '600', color: '#123028', marginBottom: 8 },
  text: { fontSize: 14, color: '#234A38', marginBottom: 16 },
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
  },
  logoutButton: {
    backgroundColor: '#D84343',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  divider: {
    height: 1,
    backgroundColor: '#B7D9A8',
    marginVertical: 16,
  },
});

export default AdminLoginScreen;

import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../App';

const AdminLoginScreen = () => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!auth) return;
    const ok = await auth.loginAsAdmin(password);
    if (!ok) {
      Alert.alert('Gagal', 'Password admin salah');
    } else {
      setPassword('');
      Alert.alert('Sukses', 'Anda login sebagai admin');
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await auth.logout();
    Alert.alert('Logout', 'Anda keluar dari mode admin');
  };

  if (auth?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mode Admin Aktif</Text>
        <Text style={styles.text}>
          Anda dapat mengubah, menambah, dan menghapus pengumuman serta agenda.
        </Text>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout Admin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Admin</Text>
      <Text style={styles.text}>Masukkan password khusus admin untuk mengelola data.</Text>
      <TextInput
        style={styles.input}
        placeholder="Password admin"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F7D9', padding: 16, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#123028', marginBottom: 8 },
  text: { fontSize: 14, color: '#234A38', marginBottom: 16 },
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
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default AdminLoginScreen;

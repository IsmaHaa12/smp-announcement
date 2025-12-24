// src/screens/WelcomeScreen.tsx
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../../App';

type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const auth = useContext(AuthContext);

  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [studentModalVisible, setStudentModalVisible] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const handleGuest = async () => {
    await AsyncStorage.setItem('isGuest', 'true');
    navigation.replace('Main');
  };

  const handleAdminLogin = async () => {
    if (!auth) return;

    const ok = await auth.loginAsAdmin(adminEmail, adminPassword);
    if (!ok) {
      Alert.alert('Gagal', 'Email atau password admin salah');
      return;
    }

    await AsyncStorage.setItem('isGuest', 'false');
    setAdminEmail('');
    setAdminPassword('');
    setAdminModalVisible(false);
    navigation.replace('Main');
  };

  const handleStudentLogin = async () => {
    if (!auth) return;

    const ok = await auth.loginAsStudent(studentEmail, studentPassword);
    if (!ok) {
      Alert.alert('Gagal', 'Email atau password siswa salah');
      return;
    }

    await AsyncStorage.setItem('isGuest', 'false');
    setStudentEmail('');
    setStudentPassword('');
    setStudentModalVisible(false);
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo-smpn2ayah.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>SMP Negeri 2 Ayah</Text>
      <Text style={styles.subtitle}>Aplikasi Informasi Sekolah</Text>

      <TouchableOpacity
        style={[styles.button, styles.adminButton]}
        onPress={() => setAdminModalVisible(true)}
      >
        <Text style={styles.buttonText}>Mode Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.guestButton]}
        onPress={() => setStudentModalVisible(true)}
      >
        <Text style={styles.buttonText}>Login Siswa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.guestButton]}
        onPress={handleGuest}
      >
        <Text style={styles.buttonText}>Masuk sebagai Tamu</Text>
      </TouchableOpacity>

      {/* Modal Admin */}
      <Modal
        visible={adminModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAdminModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Masuk sebagai Admin</Text>
            <TextInput
              style={styles.input}
              placeholder="Email admin"
              placeholderTextColor="#7A9585"
              autoCapitalize="none"
              keyboardType="email-address"
              value={adminEmail}
              onChangeText={setAdminEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password admin"
              placeholderTextColor="#7A9585"
              secureTextEntry
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.smallButton, styles.cancel]}
                onPress={() => setAdminModalVisible(false)}
              >
                <Text style={styles.smallText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.ok]}
                onPress={handleAdminLogin}
              >
                <Text style={styles.smallText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Siswa */}
      <Modal
        visible={studentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setStudentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Masuk sebagai Siswa</Text>
            <TextInput
              style={styles.input}
              placeholder="Email siswa"
              placeholderTextColor="#7A9585"
              autoCapitalize="none"
              keyboardType="email-address"
              value={studentEmail}
              onChangeText={setStudentEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password siswa"
              placeholderTextColor="#7A9585"
              secureTextEntry
              value={studentPassword}
              onChangeText={setStudentPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.smallButton, styles.cancel]}
                onPress={() => setStudentModalVisible(false)}
              >
                <Text style={styles.smallText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.ok]}
                onPress={handleStudentLogin}
              >
                <Text style={styles.smallText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7D9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: { width: 140, height: 140, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#123028', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#234A38', marginBottom: 32 },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  adminButton: { backgroundColor: '#1F6FB2' },
  guestButton: { backgroundColor: '#4CAF50' },
  buttonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#F3FFEE',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#123028',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#B7D9A8',
    color: '#123028',
    marginBottom: 12,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancel: { backgroundColor: '#B7D9A8' },
  ok: { backgroundColor: '#1F6FB2' },
  smallText: { color: '#fff', fontWeight: '600' },
});

export default WelcomeScreen;
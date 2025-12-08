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

// ambil password admin dari .env
const ADMIN_PASSWORD = process.env.EXPO_PUBLIC_ADMIN_PASSWORD || '';

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const auth = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleGuest = async () => {
    await AsyncStorage.setItem('isGuest', 'true');
    await AsyncStorage.setItem('isAdmin', 'false');
    navigation.replace('Main');
  };

  const handleAdminLogin = async () => {
    // cek password dengan nilai dari .env
    if (password !== ADMIN_PASSWORD) {
      Alert.alert('Gagal', 'Password admin salah');
      return;
    }

    // update context (kalau ada) + AsyncStorage
    if (auth) {
      await auth.loginAsAdmin(password);
    } else {
      await AsyncStorage.setItem('isAdmin', 'true');
      await AsyncStorage.setItem('isGuest', 'false');
    }

    setPassword('');
    setModalVisible(false);
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
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Login Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.guestButton]}
        onPress={handleGuest}
      >
        <Text style={styles.buttonText}>Login Umum</Text>
      </TouchableOpacity>

      {/* Modal input password admin */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Masuk sebagai Admin</Text>
            <TextInput
              style={styles.input}
              placeholder="Password admin"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.smallButton, styles.cancel]}
                onPress={() => setModalVisible(false)}
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

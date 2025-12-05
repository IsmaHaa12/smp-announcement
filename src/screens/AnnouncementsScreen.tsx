import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
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

type Props = {
  isAdmin: boolean;
};

const STORAGE_KEY = 'announcements';

const AnnouncementsScreen: React.FC<Props> = ({ isAdmin }) => {
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    date: '',
    category: '',
    content: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAnnouncements(JSON.parse(stored));
        } else {
          setAnnouncements(defaultAnnouncements as Announcement[]);
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultAnnouncements)
          );
        }
      } catch (e) {
        console.log('Error loading announcements', e);
        setAnnouncements(defaultAnnouncements as Announcement[]);
      }
    };

    loadData();
  }, []);

  const saveAnnouncements = async (data: Announcement[]) => {
    setAnnouncements(data);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('Error saving announcements', e);
    }
  };

  const handleAddOrEdit = () => {
    if (!form.title || !form.date) return;

    if (editingId) {
      const updated = announcements.map((a) =>
        a.id === editingId
          ? {
              ...a,
              title: form.title,
              date: form.date,
              category: form.category || 'Umum',
              content: form.content,
            }
          : a
      );
      saveAnnouncements(updated);
    } else {
      const newItem: Announcement = {
        id: Date.now().toString(),
        title: form.title,
        date: form.date,
        category: form.category || 'Umum',
        content: form.content,
      };
      const updated = [newItem, ...announcements];
      saveAnnouncements(updated);
    }

    setForm({ title: '', date: '', category: '', content: '' });
    setEditingId(null);
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    saveAnnouncements(updated);
  };

  const openEdit = (item: Announcement) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.date,
      category: item.category,
      content: item.content ?? '',
    });
    setModalVisible(true);
  };

  const filtered = announcements.filter((item) =>
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
          <View style={styles.cardWrapper}>
            <AnnouncementCard
              title={item.title}
              date={item.date}
              category={item.category}
              content={item.content}
            />
            {isAdmin && (
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => openEdit(item)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{ marginLeft: 12 }}
                >
                  <Text style={styles.deleteText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* FAB Tambah hanya untuk admin */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditingId(null);
            setForm({ title: '', date: '', category: '', content: '' });
            setModalVisible(true);
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          setEditingId(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Judul"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Tanggal (yyyy-mm-dd)"
              value={form.date}
              onChangeText={(text) => setForm({ ...form, date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Kategori (mis. Akademik/Kegiatan)"
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Isi pengumuman"
              multiline
              value={form.content}
              onChangeText={(text) => setForm({ ...form, content: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingId(null);
                }}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={handleAddOrEdit}
              >
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cardWrapper: {
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginRight: 8,
  },
  editText: { color: '#1F6FB2', fontSize: 12, fontWeight: '600' },
  deleteText: { color: '#D84343', fontSize: 12, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1F6FB2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, marginTop: -2 },
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#B7D9A8',
    color: '#123028',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonCancel: { backgroundColor: '#B7D9A8' },
  buttonSave: { backgroundColor: '#1F6FB2' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
export default AnnouncementsScreen;
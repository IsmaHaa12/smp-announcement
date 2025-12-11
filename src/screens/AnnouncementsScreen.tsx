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
import AnnouncementCard from '../components/AnnouncementCard';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

type Announcement = {
  id: string;
  title: string;
  date: string; // buat tampilan "yyyy-mm-dd"
  category: string;
  content?: string;
};

type Props = {
  isAdmin: boolean;
};

const AnnouncementsScreen: React.FC<Props> = ({ isAdmin }) => {
  const [search, setSearch] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    dateText: '',        // string buat TextInput
    dateValue: new Date(), // Date asli buat Firestore
    category: '',
    content: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // === LOAD DATA DARI FIRESTORE (REALTIME) ===
  useEffect(() => {
    const q = query(
      collection(db, 'announcements'),
      orderBy('date', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      console.log('SNAPSHOT SIZE', snapshot.size);
      const items: Announcement[] = snapshot.docs.map((d) => {
        const data = d.data() as any;

        let dateStr = '';
        if (data.date?.toDate) {
          const dateObj = data.date.toDate(); // Timestamp -> Date
          dateStr = dateObj.toISOString().slice(0, 10); // yyyy-mm-dd
        } else if (typeof data.date === 'string') {
          dateStr = data.date;
        }

        return {
          id: d.id,
          title: data.title,
          date: dateStr,
          category: data.category,
          content: data.content,
        };
      });
      setAnnouncements(items);
    });

    return () => unsub();
  }, []);

  // === HANDLE DATE PICKER CHANGE ===
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || form.dateValue;
    const dateStr = currentDate.toISOString().slice(0, 10); // yyyy-mm-dd
    setForm((prev) => ({
      ...prev,
      dateValue: currentDate,
      dateText: dateStr,
    }));
    setShowDatePicker(false);
  };

  // === TAMBAH / EDIT KE FIRESTORE ===
  const handleAddOrEdit = async () => {
    if (!form.title || !form.dateText) return;
    if (!isAdmin) return;

    try {
      const payload = {
        title: form.title,
        date: Timestamp.fromDate(form.dateValue),
        category: form.category || 'Umum',
        content: form.content,
      };

      if (editingId) {
        const ref = doc(db, 'announcements', editingId);
        await updateDoc(ref, payload);
      } else {
        await addDoc(collection(db, 'announcements'), payload);
      }
    } catch (e) {
      console.log('Error saving announcement', e);
    }

    setForm({
      title: '',
      dateText: '',
      dateValue: new Date(),
      category: '',
      content: '',
    });
    setEditingId(null);
    setModalVisible(false);
  };

  // === HAPUS DI FIRESTORE ===
  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      const ref = doc(db, 'announcements', id);
      await deleteDoc(ref);
    } catch (e) {
      console.log('Error deleting announcement', e);
    }
  };

  const openEdit = (item: Announcement) => {
    // saat edit, pakai string tanggal dari item.date
    let dateObj = new Date();
    if (item.date) {
      const parsed = new Date(item.date);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }

    setEditingId(item.id);
    setForm({
      title: item.title,
      dateText: item.date,
      dateValue: dateObj,
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

      {/* FAB tambah hanya admin */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditingId(null);
            setForm({
              title: '',
              dateText: '',
              dateValue: new Date(),
              category: '',
              content: '',
            });
            setModalVisible(true);
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Modal tambah / edit */}
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
              placeholderTextColor="#7A9585"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            {/* Input tanggal pakai DatePicker */}
            <TextInput
              style={styles.input}
              placeholder="Tanggal (pilih dari kalender)"
              placeholderTextColor="#7A9585"
              value={form.dateText}
              onPressIn={() => setShowDatePicker(true)}
              editable={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Kategori (mis. Akademik/Kegiatan)"
              placeholderTextColor="#7A9585"
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Isi pengumuman"
              placeholderTextColor="#7A9585"
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

      {/* DateTimePicker untuk tanggal */}
      {showDatePicker && (
        <DateTimePicker
          value={form.dateValue}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
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

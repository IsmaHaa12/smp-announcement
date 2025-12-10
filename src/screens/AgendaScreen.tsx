import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

type Event = {
  id: string;
  title: string;
  date: string;
};

type Props = {
  isAdmin: boolean;
};

const AgendaScreen: React.FC<Props> = ({ isAdmin }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const opacity = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', date: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snapshot) => {
      const items: Event[] = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        date: d.data().date,
      }));
      setEvents(items);
    });

    return () => unsub();
  }, []);

  const markedDates = events.reduce((acc: any, event: Event) => {
    acc[event.date] = {
      marked: true,
      dotColor: '#1F6FB2',
      selected: event.date === selectedDate,
      selectedColor: '#1F6FB2',
    };
    return acc;
  }, {});

  const eventsForSelected = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  useEffect(() => {
    if (!selectedDate) return;
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [selectedDate, opacity]);

  const handleAddOrEdit = async () => {
    if (!form.title || !form.date) return;
    if (!isAdmin) return;

    try {
      if (editingId) {
        const ref = doc(db, 'events', editingId);
        await updateDoc(ref, {
          title: form.title,
          date: form.date,
        });
      } else {
        await addDoc(collection(db, 'events'), {
          title: form.title,
          date: form.date,
        });
      }
    } catch (e) {
      console.log('Error saving event', e);
    }

    setForm({ title: '', date: '' });
    setEditingId(null);
    setModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      const ref = doc(db, 'events', id);
      await deleteDoc(ref);
    } catch (e) {
      console.log('Error deleting event', e);
    }
  };

  const openEdit = (item: Event) => {
    setEditingId(item.id);
    setForm({ title: item.title, date: item.date });
    setSelectedDate(item.date);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setForm((prev) => ({ ...prev, date: day.dateString }));
        }}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#E6F7D9',
          calendarBackground: '#E6F7D9',
          selectedDayBackgroundColor: '#1F6FB2',
          todayTextColor: '#D84343',
          dayTextColor: '#123028',
          arrowColor: '#1F6FB2',
          monthTextColor: '#123028',
        }}
      />
      <Animated.View style={[styles.listContainer, { opacity }]}>
        <Text style={styles.header}>
          Agenda {selectedDate ?? '(pilih tanggal)'}
        </Text>
        <FlatList
          data={eventsForSelected}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventRow}>
              <Text style={styles.eventItem}>• {item.title}</Text>
              {isAdmin && (
                <>
                  <TouchableOpacity
                    onPress={() => openEdit(item)}
                    style={{ marginLeft: 8 }}
                  >
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={{ marginLeft: 8 }}
                  >
                    <Text style={styles.deleteText}>Hapus</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Belum ada kegiatan pada tanggal ini.
            </Text>
          }
        />
      </Animated.View>

      {isAdmin && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditingId(null);
            setForm((prev) => ({
              ...prev,
              title: '',
              date: selectedDate || '',
            }));
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
              {editingId ? 'Edit Agenda' : 'Tambah Agenda'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Judul kegiatan"
              placeholderTextColor="#7A9585"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Tanggal (yyyy-mm-dd)"
              placeholderTextColor="#7A9585"
              value={form.date}
              onChangeText={(text) => setForm({ ...form, date: text })}
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
  container: { flex: 1, backgroundColor: '#E6F7D9' },
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3FFEE',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#123028',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventItem: { fontSize: 14, color: '#234A38' },
  editText: { fontSize: 12, color: '#1F6FB2', fontWeight: '600' },
  deleteText: { fontSize: 12, color: '#D84343', fontWeight: '600' },
  empty: { fontSize: 14, color: '#7A9585', marginTop: 8 },
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

export default AgendaScreen;

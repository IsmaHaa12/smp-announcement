import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const SchoolProfileScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>SMP Negeri 2 Ayah</Text>

      <Text style={styles.sectionTitle}>Profil Singkat</Text>
      <Text style={styles.paragraph}>
        SMP Negeri 2 Ayah terletak di Desa Jintung, Kecamatan Ayah, Kabupaten Kebumen.
      </Text>
      <Text style={styles.paragraph}>
        Sekolah ini berdiri atas prakarsa bersama tokoh pendidikan setempat, antara lain
        Sarto Wibowo (Kepala Desa Jintung dan guru SD Negeri 2 Jintung saat itu),
        Sarpin Suhardi (Kepala SD Negeri 1 Jintung), Sayudi (guru SD Negeri 1 Jintung),
        serta Bambang Wijayatmoko (guru SD Negeri 2 Jintung) yang menginginkan adanya
        SMP Negeri di desa mereka.
      </Text>

      <Text style={styles.sectionTitle}>Sejarah Berdiri</Text>
      <Text style={styles.paragraph}>
        Latar belakang berdirinya SMP Negeri 2 Ayah tidak lepas dari semakin banyaknya
        warga yang ingin bersekolah, sementara di wilayah tersebut saat itu hanya
        terdapat sekolah swasta berbiaya relatif mahal dan SMP Negeri terdekat
        berjarak cukup jauh dengan medan berbukit-bukit.
      </Text>
      <Text style={styles.paragraph}>
        Keempat tokoh pendidikan tadi berjuang cukup lama untuk mendirikan SMP Negeri,
        dimulai sekitar akhir tahun 1980-an. Pembangunan fisik sekolah mulai berjalan
        pada tahun 1993. Tahun ajaran 1994/1995 SMP Negeri 2 Ayah sudah mulai
        beroperasi, namun Surat Keputusan dari Menteri Pendidikan dan Kebudayaan
        baru turun pada 26 Oktober 1995.
      </Text>

      <Text style={styles.sectionTitle}>Kondisi Saat Ini</Text>
      <Text style={styles.paragraph}>
        Saat ini SMP Negeri 2 Ayah memiliki 15 rombongan belajar yang terdiri dari
        5 rombongan belajar kelas 7, 5 rombongan belajar kelas 8, dan 5 rombongan
        belajar kelas 9.
      </Text>
      <Text style={styles.paragraph}>
        Setiap rombongan belajar diisi sekitar 28 hingga 32 peserta didik sehingga
        total peserta didik mencapai kurang lebih 450 siswa.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#E6F7D9',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#123028',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#1F6FB2',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#234A38',
    textAlign: 'justify',
    marginBottom: 6,
  },
});

export default SchoolProfileScreen;
import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // npx expo install expo-linear-gradient

type Props = {
  title: string;
  date: string;
  category: string;
  content?: string;
};

const AnnouncementCard: React.FC<Props> = ({ title, date, category, content }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.shadowWrap, { opacity }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F3FFEE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {category?.[0] ?? '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        {content ? <Text style={styles.content}>{content}</Text> : null}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    borderRadius: 20,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F6FB2', // biru dari logo
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#123028',
  },
  date: {
    fontSize: 12,
    color: '#5C7A6A',
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    color: '#234A38',
    marginTop: 4,
  },
});

export default AnnouncementCard;

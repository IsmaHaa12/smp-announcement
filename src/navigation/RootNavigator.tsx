import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';   // <— ICON
import HomeScreen from '../screens/HomeScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import AgendaScreen from '../screens/AgendaScreen';
import SchoolProfileScreen from '../screens/SchoolProfileScreen';

export type RootTabParamList = {
  Home: undefined;
  Announcements: undefined;
  Agenda: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#DDF3C8' },
        headerTitleAlign: 'center',
        headerTitle: 'SMPN 2 Ayah',
        headerLeft: () => (
          <Image
            source={require('../assets/logo-smpn2ayah.png')}
            style={{ width: 28, height: 28, marginLeft: 12 }}
            resizeMode="contain"
          />
        ),
        tabBarActiveTintColor: '#1F6FB2',
        tabBarInactiveTintColor: '#5C7A6A',
        tabBarStyle: {
          backgroundColor: '#E6F7D9',
          borderTopColor: '#B7D9A8',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Agenda') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else {
            // Profile
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{ title: 'Pengumuman' }}
      />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={{ title: 'Agenda' }} />
      <Tab.Screen name="Profile" component={SchoolProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default RootNavigator;

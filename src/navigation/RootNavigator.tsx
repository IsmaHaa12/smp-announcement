import React, { useContext, useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import AgendaScreen from '../screens/AgendaScreen';
import SchoolProfileScreen from '../screens/SchoolProfileScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import { AuthContext } from '../../App';

export type RootTabParamList = {
  Home: undefined;
  Announcements: undefined;
  Agenda: undefined;
  Profile: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator = () => {
  const auth = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: '#DDF3C8' },
        headerTitleAlign: 'center',
        headerTitle: 'SMP N 2 Ayah',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' as never }],
              })
            }
          >
            <Image
              source={require('../assets/logo-smpn2ayah.png')}
              style={{ width: 28, height: 28, marginLeft: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
          } else if (route.name === 'Profile') {
            iconName = focused ? 'school' : 'school-outline';
          } else {
            iconName = focused ? 'lock-open' : 'lock-closed';
          }

          const scaleAnim = useRef(new Animated.Value(1)).current;

          useEffect(() => {
            Animated.spring(scaleAnim, {
              toValue: focused ? 1.15 : 1,
              friction: 5,
              useNativeDriver: true,
            }).start();
          }, [focused, scaleAnim]);

          return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons name={iconName} size={size} color={color} />
            </Animated.View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Beranda' }}
      />

      <Tab.Screen
        name="Announcements"
        options={{ title: 'Pengumuman' }}
      >
        {() => <AnnouncementsScreen isAdmin={auth?.isAdmin ?? false} />}
      </Tab.Screen>

      <Tab.Screen
        name="Agenda"
        options={{ title: 'Agenda' }}
      >
        {() => <AgendaScreen isAdmin={auth?.isAdmin ?? false} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        component={SchoolProfileScreen}
        options={{ title: 'Profil' }}
      />

      {auth?.isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminLoginScreen}
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
};

export default RootNavigator;

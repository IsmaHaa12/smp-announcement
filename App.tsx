// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './src/firebaseConfig';
import RootNavigator from './src/navigation/RootNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';

export type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isStudent: boolean;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  loginAsStudent: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const LAST_ACTIVE_KEY = '@last_active_time';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Welcome' | 'Main'>('Welcome');
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = 'admin@smp2ayah.sch.id';

  useEffect(() => {
    const checkTimeout = async () => {
      const stored = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      if (!stored) return false;
      const lastActive = parseInt(stored, 10);
      const now = Date.now();
      const diffMinutes = (now - lastActive) / 1000 / 60;
      return diffMinutes > 1;
    };

    const sub = onAuthStateChanged(auth, async currentUser => {
      const expired = await checkTimeout();

      if (!currentUser || expired) {
        if (auth.currentUser) {
          await signOut(auth);
        }
        setUser(null);
        setIsAdmin(false);
        setIsStudent(false);
        await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
        setInitialRoute('Welcome');
      } else {
        setUser(currentUser);
        const isAdminAccount = currentUser.email === ADMIN_EMAIL;
        setIsAdmin(isAdminAccount);
        setIsStudent(!isAdminAccount);
        setInitialRoute('Main');
      }

      setLoading(false);
    });

    return sub;
  }, []);

  const loginAsAdmin = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isAdminAccount = cred.user.email === ADMIN_EMAIL;

      if (!isAdminAccount) {
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        setIsStudent(false);
        return false;
      }

      setUser(cred.user);
      setIsAdmin(true);
      setIsStudent(false);
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      return true;
    } catch (e) {
      console.log('Admin login error', e);
      return false;
    }
  };

  const loginAsStudent = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (cred.user.email === ADMIN_EMAIL) {
        return false;
      }
      setUser(cred.user);
      setIsAdmin(false);
      setIsStudent(true);
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      return true;
    } catch (e) {
      console.log('Student login error', e);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    setIsStudent(false);
    await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isStudent, loginAsAdmin, loginAsStudent, logout }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={RootNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
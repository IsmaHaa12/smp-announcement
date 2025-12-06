import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from './src/navigation/RootNavigator';

export type AuthContextType = {
  isAdmin: boolean;
  loginAsAdmin: (password: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(stored === 'true');
    };
    load();
  }, []);

  const loginAsAdmin = async (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      await AsyncStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAdmin(false);
    await AsyncStorage.setItem('isAdmin', 'false');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loginAsAdmin, logout }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from './src/navigation/RootNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';

export type AuthContextType = {
  isAdmin: boolean;
  loginAsAdmin: (password: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialRoute, setInitialRoute] = useState<'Welcome' | 'Main'>('Welcome');

  useEffect(() => {
    const load = async () => {
      const storedAdmin = await AsyncStorage.getItem('isAdmin');
      const storedGuest = await AsyncStorage.getItem('isGuest');
      setIsAdmin(storedAdmin === 'true');

      if (storedAdmin === 'true' || storedGuest === 'true') {
        setInitialRoute('Main');
      }
    };
    load();
  }, []);

  const loginAsAdmin = async (password: string) => {
    if (password === 'Asewrusrek123') {
      setIsAdmin(true);
      await AsyncStorage.setItem('isAdmin', 'true');
      await AsyncStorage.setItem('isGuest', 'false');
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

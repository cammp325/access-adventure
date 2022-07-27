import React from 'react';
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TailwindProvider>
          <StackNavigator />
        </TailwindProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
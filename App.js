import React from 'react';
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from './hooks/useAuth';
import { Provider as PaperProvider } from 'react-native-paper';
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthProvider>
          <TailwindProvider>
            <StackNavigator />
          </TailwindProvider>
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
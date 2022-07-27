import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import useAuth from './hooks/useAuth'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const { user } = useAuth();
  return (
    <Stack.Navigator initialRouteName={!user ? "Login" : "Home"}>
            <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen  name="Login" component={LoginScreen} />
        </>

    </Stack.Navigator>
  )
}

export default StackNavigator
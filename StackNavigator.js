import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import LoginScreen from './screens/LoginScreen'
import AccountScreen from './screens/AccountScreen'
import useAuth from './hooks/useAuth'
import ProfileScreen from './screens/ProfileScreen'
import SwipeScreen from './screens/SwipeScreen'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const { user } = useAuth();
  return (
    <Stack.Navigator initialRouteName={!user ? "Login" : "Home"}>
            <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Swipe" component={SwipeScreen} />
                <Stack.Screen  name={user ? "Logout" : "Login"} component={LoginScreen} />
        </>

    </Stack.Navigator>
  )
}

export default StackNavigator
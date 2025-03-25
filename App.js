import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './context/UserContext';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChannelsScreen from './src/screens/ChannelsScreen';
import ChatScreen from './src/screens/ChatScreen';
import GeneralChatScreen from './src/screens/GeneralChatScreen';
import AssignmentsScreen from './src/screens/AssignmentsScreen';

import ClassScreen from './src/screens/ClassScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GradesScreen from './src/screens/GradesScreen';
import FriendsScreen from './src/screens/FriendsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
  <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        {/* SignUp Screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{
          title: 'Sign Up',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />

        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChannelsScreen" component={ChannelsScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="GeneralChatScreen" component={GeneralChatScreen} />
        <Stack.Screen name="AssignmentsScreen" component={AssignmentsScreen} />
        <Stack.Screen name="Class" component={ClassScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Marks" component={GradesScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}
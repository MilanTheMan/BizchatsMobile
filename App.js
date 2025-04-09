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
import ChannelSettingsScreen from './src/screens/ChannelSettingsScreen';
import PersonalScreen from './src/screens/PersonalScreen';
import ProfessionalScreen from './src/screens/ProfessionalScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';




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
        <Stack.Screen name="ChannelsScreen" component={ChannelsScreen} options={{ title: 'All Channels' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Class Chat' }} />
        <Stack.Screen name="GeneralChatScreen" component={GeneralChatScreen} options={{ title: 'General Chat' }} />
        <Stack.Screen name="AssignmentsScreen" component={AssignmentsScreen} options={{ title: 'Assignments' }} />
        <Stack.Screen name="Class" component={ClassScreen} options={{ title: 'Classroom' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'App Settings' }} />
        <Stack.Screen name="Marks" component={GradesScreen} options={{ title: 'Grades & Progress' }} />
        <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Friends' }} />
        <Stack.Screen name="ChannelSettingsScreen" component={ChannelSettingsScreen} options={{ title: 'Channel Settings' }} />
        <Stack.Screen name="PersonalScreen" component={PersonalScreen} options={{ title: 'Personal Chat' }} />
        <Stack.Screen name="ProfessionalScreen" component={ProfessionalScreen} options={{ title: 'Professional Chat' }} />
        <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} options={{ title: 'Channel Schedule' }} />


      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}
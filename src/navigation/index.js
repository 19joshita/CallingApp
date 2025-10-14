import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactListScreen from './../screen/ContactListScreen';
import CallScreen from './../screen/CallScreen';
import IncomingCallScreen from './../screen/IncomingCallScreen';
import CallLogsScreen from './../screen/CallLogsScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Contacts" component={ContactListScreen} />
      <Stack.Screen name="Call" component={CallScreen} />
      <Stack.Screen name="Incoming" component={IncomingCallScreen} />
      <Stack.Screen name="Logs" component={CallLogsScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

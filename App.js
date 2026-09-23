// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// นำเข้าหน้าเลือกอาหารที่แยกไฟล์ไว้
import MenuScreen from './src/screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="MenuScreen" 
          component={MenuScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
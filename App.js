import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Header } from 'react-native-elements';
import 'react-native-gesture-handler';


import AuthNavigator from './navigation/AuthNavigator'
import { HeaderButtons} from 'react-navigation-header-buttons';



global.apiURL='http://192.168.18.16/WebApplication1/api'

const Stack = createNativeStackNavigator();
//console.disableYellowBox = true;
function App() {
  
  return (
   
    
    <NavigationContainer>
 
      <AuthNavigator  
        />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    margin: 10,
  }
})

export default App;
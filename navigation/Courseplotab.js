import 'react-native-gesture-handler';

import * as React from 'react';
import { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import course from '../admin/course';
import allocation from '../admin/allocation';
import plo from '../admin/plo';
import showcourseplomapping from '../admin/showcourseplomapping';
import courseplomapping from '../admin/courseplomapping';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
import Header from '../components/Header';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
 AsyncStorage,
  Modal,
  ActivityIndicator,
} from 'react-native';
function Courseplotab() {
  const [CourseMappingPlos, setCourseMappingPlos] = useState([]);

  const GetAllmapping = async (Id, sessionN) => {
    try {
      const response = await fetch(
        `${global.apiURL}/CLOsPLOsMapping/GetCourseMappedPLOs?progaramID=${Id}&session=${sessionN}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();

      setCourseMappingPlos(data);
      console.log(data)
    } catch (error) {
      console.error(error);
    }
    console.log('new dataaaaaaaaaaaaa', cloploData);
  };

  const getStoredprogram = async () => {
    try {
      const storedObject = await AsyncStorage.getItem('program');
      const sessionName = await AsyncStorage.getItem('Session');
      console.log('Stored object:', storedObject);
      if (storedObject !== null || sessionName !== null) {
        const parsedObject = JSON.parse(storedObject);
        console.log('Parsed object:', parsedObject);

       
        GetAllmapping(parsedObject.P_Id, sessionName);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };

  useEffect(() => {
    getStoredprogram();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <Header />,
      }}
      tabBarOptions={{
        activeTintColor: '#42f44b',
      }}
    >
      <Tab.Screen
        name="course"
        component={course}
        options={{
          tabBarLabel: 'Course',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color="gray" />
          ),
          headerBackVisible: true,
        }}
      />
      <Tab.Screen
        name="allocation"
        component={allocation}
        options={{
          tabBarLabel: 'Allocation',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="archive-check"
              size={size}
              color="gray"
            />
          ),
          headerBackVisible: true,
        }}
      />
      <Tab.Screen
        name="plo"
        component={plo}
        options={{
          tabBarLabel: 'PLO',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color="gray" />
          ),
          headerBackVisible: true,
        }}
      />
      {CourseMappingPlos.length < 1 ? (
        <Tab.Screen
          name="courseplomapping"
          component={
            courseplomapping}
            options={{
              tabBarLabel: 'Mapping',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="archive-check"
                  size={size}
                  color="gray"
                />
              ),
              headerBackVisible: true,
            }}
          />
        ) : (
          <Tab.Screen
            name="showcourseplomapping"
            component={showcourseplomapping}
            options={{
              tabBarLabel: 'Mapping',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="archive-check"
                  size={size}
                  color="gray"
                />
              ),
              headerBackVisible: true,
            }}
          />
        )}
      </Tab.Navigator>
    );
  }
  
  export default Courseplotab;
  
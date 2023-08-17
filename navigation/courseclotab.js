import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import clo from '../teacherscreen/clo';
import activitymapping from '../teacherscreen/activitymapping';
import cloplomapping from '../teacherscreen/cloplomapping';
import updatecloactivitymapping from '../teacherscreen/updatecloactivitymapping';
import updatecloplomapping from '../teacherscreen/updatecloplomapping';
import approvedcloplo from '../teacherscreen/approvedcloplo';
import approvedactivity from '../teacherscreen/approvedactivity';
import activity from '../teacherscreen/activity';
import Header from '../components/Header'
import approvedcloplomapping from '../admin/approvedcloplomapping';
import approvedcloactivitymappng from '../admin/approvedcloactivitymappng';
//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/*function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#42f44b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home Page' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Details Page' }}
      />
    </Stack.Navigator>
  );
}*/


function Courseclotab() {
  const [Allocate, setAllocate] = useState(false);
  const [user, setuser] = useState('');
  const [cloploData, setcloploData] = useState([]);
  const [cloactivityData, setcloactivityData] = useState([]);
   const  [suggestion,setsuggestion]  = useState('');     
  
  
  
   
  const GetAllCLOs = async (Id) => {
    try {
   
      const response = await fetch(
        `${global.apiURL}/CLOsPLOsMapping/GetAllCLOsPLOsMapping?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();

     setcloploData(data);
     console.log('new dataaaaaaaaaaaaa activity',data)
     console.log(data);
    console.log(data);

    
    } catch (error) {
      console.error(error);
    } 
   
  };
  const GetAllCLOsactivity = async (Id) => {
    try {
   
      const response = await fetch(
        `${global.apiURL}/ActivityMappingCLOs/GetAllActivityCLOsMapping?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();

     setcloactivityData(data);
     console.log('new dataaaaaaaaaaaaa  activity',data)
     console.log(data);
    console.log(data);

    
    } catch (error) {
      console.error(error);
    } 
   
  };

    

  
  
  useEffect(() => {
    async function fetchData() {
      const allocation = await AsyncStorage.getItem('allocation');
      const User = await AsyncStorage.getItem('user');
      const cid= await AsyncStorage.getItem('coursID');
      const cname= await AsyncStorage.getItem('courseName');
      const suggestion1= await AsyncStorage.getItem('suggestion');
      if (allocation !== null || cid !== null || cname !== null) {
        console.log('teacher',allocation)
        setuser(User)
       GetAllCLOs(cid)
       setsuggestion(suggestion1);
       GetAllCLOsactivity(cid)
       setAllocate(allocation)
        
      }
    }
    fetchData();
  
  }, []);
  console.log('suggestion', suggestion)
  console.log('allocated',Allocate)
//console.log('allocat',Allocate)
  return (
    <>
     <Tab.Navigator
          screenOptions={{headerRight:() => (
            <Header/>
          )}}
          tabBarOptions={{
            activeTintColor: '#42f44b',
          }}>
            <Tab.Screen
          name="clo"
          component={clo}
          options={{
            tabBarLabel: 'CLOs',
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="book"
                size={size}
                color='gray'
              />
            ),
            headerBackVisible:true
          }}
        />
       
 {Allocate === "true" &&
          cloploData[0]?.Status != "approved" &&
          cloploData[0]?.Status != "suggestion" &&
          cloploData?.length == 0 && (
          <>
        
          <Tab.Screen
            name="cloplomapping"
            component={cloplomapping}
            options={{
              tabBarLabel: 'Mapping on PLOs',
              tabBarIcon: ({ color, size }) => (
                <Icon
                  name="book"
                  size={size}
                  color='gray'
                />
              ),
              headerBackVisible:true
            }}
          />
       
    </>
            
          )}

{Allocate === "true" &&
          cloactivityData[0]?.Status != "approved" &&
          cloactivityData[0]?.Status != "suggestion" &&
          cloactivityData?.length == 0 && (
            <>
               <Tab.Screen
          name="activitymapping"
          component={activitymapping}
          options={{
            tabBarLabel: 'Mapping Activity',
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="book"
                size={size}
                color='gray'
              />
            ),
            headerBackVisible:true
          }}
        />
     
        
    
     
            </>
        )}
 {Allocate === "true" &&
          cloploData[0]?.Status == "suggestion" && suggestion=="true" && (
            <>
          
           <Tab.Screen
          name="updatecloplomapping"
          component={updatecloplomapping}
          options={{
            tabBarLabel: 'Mapping on PLO',
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="book"
                size={size}
                color='gray'
              />
            ),
            headerBackVisible:true
          }}
        />
        
        
            
            </>
          )}


{Allocate === "true" &&
         cloactivityData[0]?.Status == "suggestion"  && suggestion=="true" && (
            <>
              
           
        
        <Tab.Screen
          name="updatecloactivitymapping"
          component={updatecloactivitymapping}
          options={{
            tabBarLabel: 'Mapping on Activity',
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="book"
                size={size}
                color='gray'
              />
            ),
            headerBackVisible:true
          }}
        />
      
            </>
          )}
          
          
{cloactivityData[0]?.Status == "approved" &&
cloploData[0]?.Status == "approved" && user!=="admin"&&
     (
       <>
        
          <Tab.Screen
            name="approvedcloplo"
            component={approvedcloplo}
            options={{
              tabBarLabel: 'Mapping on PLOs',
              tabBarIcon: ({ color, size }) => (
                <Icon
                  name="book"
                  size={size}
                  color='gray'
                />
              ),
              headerBackVisible:true
            }}
          />
          <Tab.Screen
            name="approvedactivity"
            component={approvedactivity}
            options={{
              tabBarLabel: 'Mapping on Activity',
              tabBarIcon: ({ color, size }) => (
                <Icon
                  name="book"
                  size={size}
                  color='gray'
                />
              ),
              headerBackVisible:true
            }}
          />
           
           <Tab.Screen
            name="activity"
            component={activity}
            options={{
              tabBarLabel: 'Create Activity',
              tabBarIcon: ({ color, size }) => (
                <Icon
                  name="book"
                  size={size}
                  color='gray'
                />
              ),
              headerBackVisible:true
            }}
          />
            
      </>
             
          )}
          
          {
     user=="admin"&&(
        <>
          
          <Tab.Screen
            name="approvedcloplomapping"
            component={approvedcloplomapping}
            options={{
              tabBarLabel: 'Mapping on PLOs',
              tabBarIcon: ({ color, size }) => (
                <Icon
                  name="book"
                  size={size}
                  color='gray'
                />
              ),
              headerBackVisible:true
            }}
          />
          <Tab.Screen
            name="approvedcloactivitymappng"
            component={approvedcloactivitymappng}
            options={{
              tabBarLabel: 'Mapping on Activity',
              tabBarIcon: ({ color, size }) => (
                <Icon
                  name="book"
                  size={size}
                  color='gray'
                />
              ),
              headerBackVisible:true
            }}
          />
           
         
          </>  
      
         ) }
          



</Tab.Navigator>
</>
  );
}

export default Courseclotab;

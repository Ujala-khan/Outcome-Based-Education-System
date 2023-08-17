import React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

import 'react-native-gesture-handler';
import login from '../admin/login'
import program from '../admin/program'
import parent from '../admin/parent'
import addcourse from '../admin/addcourse'
import precourse from '../admin/precourse'
import courseclotab from '../navigation/courseclotab'
import addplo from '../admin/addplo'
import courseplotab from './Courseplotab'
import preplos from '../admin/preplos'
import teacher from '../admin/teacher'
import student from '../admin/student'
import Show_CLOs_PLOs_Mapping from '../admin/Show_CLOs_PLOs_Mapping'
import Show_CLOs_activity_Mapping from '../admin/Show_CLOs_activity_Mapping'
import Header from '../components/Header'
import Notifications from '../components/Notifications'

import checkactivities from '../teacherscreen/checkactivities'
import studentdata from '../teacherscreen/studentdata'
import questionmarks from '../teacherscreen/questionmarks'
import drawernavigation from '../navigation/drawernavigation'

import { Button,TouchableOpacity,View} from 'react-native';



const Stack = createNativeStackNavigator();

function AuthNavigator() {
  
  return (
  
   
    <Stack.Navigator screenOptions={{headerRight:() => (
      <Header/>
    ),}}> 
        
        <Stack.Screen
          name="login"
          component={login}
          options={{
               header: () => null
           
             }}
        
        />
          <Stack.Screen
  name="parent"
  component={parent}
  options={{
    headerBackVisible: true,
  }}
/>

        <Stack.Screen
         name="Header" component={Header}
          options={{
               header: () => null
           
             }}
        
        />
         <Stack.Screen
         name="Notifications" component={Notifications}
          options={{
              headerBackVisible:true
           
             }}
        
        />
       { <Stack.Screen
          name="program"
          component={program}
         options={{
          headerBackVisible:false,
       
             }}
        
            />}
       
        
        <Stack.Screen
          name="preplos"
          component={preplos}
          options={{
            
            headerBackVisible:true
           
          }} 
       
           
        
        />
       {<Stack.Screen
          name="courseplotab"
          component={courseplotab}
          options={{
            
               header: () => null
             }} 
          />}
            <Stack.Screen
         name="Show_CLOs_PLOs_Mapping" component={Show_CLOs_PLOs_Mapping}
          options={{
              headerBackVisible:true
           
             }}
        
        />
        <Stack.Screen
         name="Show_CLOs_activity_Mapping" component={Show_CLOs_activity_Mapping}
          options={{
              headerBackVisible:true
           
             }}
        
        />
          {<Stack.Screen
          name="courseclotab"
          component={courseclotab}
          options={{
            
               header: () => null
             }} 
          />}
         <Stack.Screen
          name="addplo"
          component={addplo}
          options={{
            headerBackVisible:true
           
             }} 
        />
       <Stack.Screen
          name="addcourse"
          component={addcourse}
          options={{
            headerBackVisible:true
           
             }}
        />
          
        <Stack.Screen
          name="precourse"
          component={precourse}
          options={{
            headerBackVisible:true
           
             }}
        />
        
       <Stack.Screen
          name="teacher"
          component={teacher}
          options={{
            headerBackVisible:false,
            title: 'Courses',
            headerStyle: {
              backgroundColor: 'green',
            },
            headerTintColor: 'white',
          }}
        />
         <Stack.Screen
          name="checkactivities"
          component={checkactivities}
          options={{
           // headerBackVisible:false,
            title: 'Courses',
            headerStyle: {
              backgroundColor: 'green',
            },
            headerTintColor: 'white',
          }}
        />
         <Stack.Screen
          name="questionmarks"
          component={questionmarks}
          options={{
           // headerBackVisible:false,
            title: 'Courses',
            headerStyle: {
              backgroundColor: 'green',
            },
            headerTintColor: 'white',
          }}
        />
          <Stack.Screen
          name="studentdata"
          component={studentdata}
          options={{
           // headerBackVisible:false,
            title: 'Courses',
            headerStyle: {
              backgroundColor: 'green',
            },
            headerTintColor: 'white',
          }}
        />
         
       
        
         <Stack.Screen
          name="student"
          component={student}
          options={{
            headerBackVisible:true,
           
          }}
         
        />
       
      
        
        
      </Stack.Navigator>
     
  )
}


export default AuthNavigator;
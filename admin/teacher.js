import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/FontAwesome';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { TextInput, DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
const teacher = ({navigation,route}) => {
  const {Username} = route.params;
  console.log('jjjj',Username)
  const [sessionlist, setSessionlist] = useState([]);
    const [session, setSession] = useState(null);
  const [courseData, setcourseData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getAllsession = async () => {
    try {
      const response = await fetch(`${global.apiURL}/Session/GetAllSession`);
      const json = await response.json();
      const sortedData = json.sort((a, b) => new Date(b.date) - new Date(a.date));

    setSessionlist(sortedData);
      console.log('session data', sortedData);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleTypeChange = (value) => {
    console.log('value',value)
    
  setSession(value);
  getAll(value);
   
  };
  
  
   
  function moveclo(item,nextpage) {
    console.log('dataaa',item.Name,'id',item.Course_Id);
    AsyncStorage.setItem('courseName',item.Name); 
    AsyncStorage.setItem('allocation',item.Allocate);  
    AsyncStorage.setItem('coursID',JSON.stringify(item.Course_Id));  
    AsyncStorage.setItem('semester',item.Semester);  
    AsyncStorage.setItem('section',item.Section); 
    if(nextpage==='Result'){
      navigation.navigate('checkactivities')
    } else { 
      navigation.navigate('courseclotab')
    }
  }
      
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage successfully cleared!');
    } catch (e) {
      console.log('Failed to clear AsyncStorage:', e);
    }
  };

  /////////////////////////////----Fetch----////////////////////
  const getAll = async (sessionN) => {
    try {
      console.log('value1',sessionN)
      const response = await fetch(
        `${global.apiURL}/AllocationCourse/getTeacherCourses?username=${Username}&session=${sessionN}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      
      setcourseData(data);
   
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',data)
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',courseData)
        
  const removeAll = async () => {
    try {
      await AsyncStorage.multiRemove(['program', 'courseName','coursID','CourseName','CourseID','allocation','semester'
      ,'section','activitydata','aridno','Session','suggestion']);
      console.log('clear all');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    removeAll();
    getAll();
    getAllsession();
  }, []);

  return (
    <View style={styles.AppContainerActive}>
  
        <View style={styles.Container}>
        <View style={{flexDirection: 'row',marginTop:2}}>
      <View style={{marginTop:10}}> 
  <Text style={styles.text1}> Session:</Text></View>
  <Picker
    style={{ backgroundColor: 'gray',width:'60%',marginBottom:7,marginLeft:40}}
    selectedValue={session} // Add this line
  onValueChange={(itemValue) => handleTypeChange(itemValue)}>
  {sessionlist &&
    sessionlist.map((obj, index) => (
      <Picker.Item key={index} label={obj.sessionName} value={obj.sessionName} />
    ))}
  </Picker>


  </View>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : courseData.length < 1 ? (
            <View style={styles.NoData}>
          <Text style={styles.NotDataText}>
            You Have No data yet. Please Add Some!!!
          </Text>
        </View>
          ) : (
            <>
              {courseData?.map((item, index) => (
                <View key={index} style={styles.Card}>
                  <Text style={styles.text1}> {item.Name}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}> {item.Title} {item.Semester} {item.Section}</Text>
                    <Text style={styles.text}> Credit Hour: {item.Credit_Hour}</Text>
                    <View style={styles.CardButton}>
                      <TouchableOpacity
                        style={styles.DeleteButton}
                        onPress={() => moveclo(item, 'CLOs')}>
                        <Text style={styles.ButtonText}>CLOs</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.DeleteButton}
                        onPress={() => moveclo(item, 'Result')}>
                        <Text style={styles.ButtonText}>Result</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
     
    </View>
  );
};

export default teacher;



const styles = StyleSheet.create({
  AppContainerActive: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  AppContainerDisable: {
    flex: 1,
    opacity: 0.2,
    backgroundColor: '#f2f2f2',
  },
  Container: {
    margin: 4,
  },

  Card: {
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
   // padding: 16,
    margin: 3,
    marginLeft:5,
   height: 75,
   // width: 340,

    //marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
  },

  CardButton: {
    //marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:7,
    justifyContent: 'flex-end',
  },
  EditButton: {
    backgroundColor: '#342f9d',
    height: 30,
    width: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DeleteButton: {
    backgroundColor: '#5D9C59',
    height: 30,
    width: 60,
    marginLeft: 5,
    marginTop:8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Open Sans',
  },
  text: {
    color: 'black',
    fontSize: 15,
   // fontWeight: 'bold',
  },
  text1: {
    
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
   // textAlign:'center'
  },
  NoData: {
  
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:'50%',

   // top: -50,
  },
  NotDataText: {
    color: 'white',
    backgroundColor: '#eea52d',
    padding: 20,
    fontSize: 16,
    borderRadius: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 

 
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:13
   // textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  
    
});
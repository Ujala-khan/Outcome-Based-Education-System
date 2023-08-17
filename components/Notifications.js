import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, ActivityIndicator, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Icon from 'react-native-vector-icons/FontAwesome';

export default function Notifications() {
  const navigation = useNavigation();
  
  const [notificationList, setnotificationList] = useState([]);
  const [cloactivityData, setcloactivityData] = useState([]);
  const [cloploData, setcloploData] = useState([]);
  const [user, setuser] = useState('');
  const getAllnotification = async () => {
    try {
      const response = await fetch(
        `${global.apiURL}/Notifications/GetAllCLOsPLOsMappingPending`,
      );
      const json = await response.json();
      if(json==='not found'){
        setnotificationList([]);
       }else{
      setnotificationList(json);
   }
      console.log('notification is',notificationList,notificationList.length)
    } catch (error) {
      console.error(error);
    } 
  };
   
  const GetAllPLOs = async (Id) => {
    try {
   
      const response = await fetch(
        `${global.apiURL}/CLOsPLOsMapping/GetAllCLOsPLOsMapping?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();
    

     setcloploData(data);
     
     console.log('new dataaaaaaaaaaaaa',data)
     console.log(data);
    console.log(data);
if(user==='admin'){

  if (Array.isArray(data) && data.length > 0 && data[0].Status === 'pending') {
    navigation.navigate('Show_CLOs_PLOs_Mapping');
    }
    else {
    navigation.navigate('Show_CLOs_activity_Mapping');
      }
}
else{
  if (Array.isArray(data) && data.length > 0 && data[0].Status === 'suggestion') {

      AsyncStorage.setItem('suggestion',"true"); 
      AsyncStorage.setItem('allocation',"true"); 
      navigation.navigate('courseclotab');
      } 
      
   
    else {
  
      AsyncStorage.setItem('suggestion',"true"); 
      AsyncStorage.setItem('allocation',"true"); 
      navigation.navigate('courseclotab');
      }
}




    } catch (error) {
      console.error(error);
    } 
   
  };
 
  const GetAllactivity = async (Id) => {
    try {
    
      const response = await fetch(
        `${global.apiURL}/ActivityMappingCLOs/GetAllActivityCLOsMapping?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();

     setcloactivityData(data);
     
     console.log('data34',cloactivityData)
    } catch (error) {
      console.error(error);
    } 

  };

  function movenotification(item) {
    console.log('dataaa',item.Course_Id,'id',item.Name);
    if(user==='admin'){
    AsyncStorage.setItem('CourseName',item.Name); 
  
    AsyncStorage.setItem('CourseID',JSON.stringify(item.Course_Id));}
    else{
      AsyncStorage.setItem('courseName',item.Name); 
      AsyncStorage.setItem('coursID',JSON.stringify(item.Course_Id));  
      AsyncStorage.setItem('suggestion','true'); 
    }
   
   GetAllactivity(item.Course_Id)
   GetAllPLOs(item.Course_Id);
  }
  const getAllteachernotification = async (Id) => {
    try {
   
      const response = await fetch(
        `${global.apiURL}/Notifications/GetAllCLOsPLOsMappingSuggestion?teacherID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();
    console.log(data);
    if(data==='not found'){
      setnotificationList([])
    }else{

     setnotificationList(data);
     console.log('new dataaaaaaaaaaaaa',data,data.length)}
     console.log(data);
    console.log(data);

    
    } catch (error) {
      console.error(error);
    } 
   
  };
  const getStoreduser = async () => {
    try {
      const User= await AsyncStorage.getItem('user');
     
      console.log('user:', User);
      if (User!== null ) {
        setuser(user);
        console.log('User 1:', user);
        if(User==='admin'){
          getAllnotification();
        }else{
          getAllteachernotification(User);
        }
        
     
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
   
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerStyle: {
        backgroundColor: 'green'
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white' //Set Header text style
      },
    });
getStoreduser();
    //getAllnotification();
  }, []);

  return (
    <View style={styles.AppContainerActive}>
 
        <View style={styles.Container}>
          {notificationList.length === 0 ? (
            <View style={styles.NoData}>
              <Text style={styles.NotDataText}>You have no notifications yet.</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={notificationList}
              renderItem={({ item }) => {
                // Only show notifications with 'pending' status
                return (
                  <TouchableOpacity onPress={() => movenotification(item)}>
                    <View style={styles.Card}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name="bell" size={18} color={'white'} style={{ margin: 5 }} />
                        <Text style={styles.text1}>{item.Name}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.text}>{item.Teacher_Name} Section {item.Semester} {item.Section}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
    
    </View>
  );
}
  
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
     // borderColor: '#ced0d2',
     // borderTopWidth:3,
      backgroundColor:'#ced0d2',
     // borderWidth: 1,
     // marginLeft:3,
     // height: 75,
     
      borderColor: 'black',
    
      borderWidth: 1,
      
      height: 50,
    
     
    
    //paddingLeft:1,
     // borderRadius: 20,
      //margin:6,
      //marginBottom: 8,
     // justifyContent: 'center',
    },
  
    CardButton: {
      //marginTop: 2,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft:30,
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
      backgroundColor: '#AD383E',
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
     marginLeft:30,
    },
    text1: {
      
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      //textAlign:'center'
    },
    NoData: {
     // flex: 1,
      alignItems: 'center',
      marginTop:60,
    
      justifyContent: 'center',
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
  
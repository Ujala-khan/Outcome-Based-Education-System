import React, {useState, useEffect} from 'react';
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
//import Icon from 'react-native-ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/FontAwesome';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {TextInput, DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';

const checkactivities = ({navigation}) => {

    const[C_Id,setC_Id]=useState('')
    const[CName,setCName]=useState('')
    const[Semester,setSemester]=useState('')
    const[Section,setSection]=useState('')
    const[Username,setUsername]=useState('')
  
  const [activityData, setactivityData] = useState([]);
  const [isLoading, setLoading] = useState(true);
   
   
    
  ///get data from async
  const movenextpage=async(item)=>{
    AsyncStorage.setItem('activitydata',JSON.stringify(item));  
       navigation.navigate('studentdata',{data:item})
  }
  
  const getStoredcourse = async () => {
    try {
      const cid= await AsyncStorage.getItem('coursID');
      const cname= await AsyncStorage.getItem('courseName');
      const user= await AsyncStorage.getItem('user');
      const semester= await AsyncStorage.getItem('semester');
      const section= await AsyncStorage.getItem('section');
     
     
     
      console.log('Stored object:', cid,cname);
      if (cid !== null || cname!==null  || user!==null|| semester!==null  || section!==null) {
       
        console.log('Parsed object cid:', cid);
        console.log('Parsed object name:', cname);
        setC_Id(cid);
        setCName(cname);
        setUsername(user);
        setSection(section);
        setSemester(semester)
      
        console.log('State variables:', C_Id, CName);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };

  /////////////////////////////----Fetch----////////////////////
  const getunmarkedactivities = async (obj) => {
    try {
        console.log('object',obj)
      const response = await fetch(`${global.apiURL}/Activity/getUnMarkedActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
  
      if (response.ok) {
        const result = await response.json();
        setactivityData(result);

        // Process the result here
        console.log(result);
        setLoading(false);
      } else {
        console.error('Request failed:', response.status);
      }
    } catch (error) {
      console.error('Request error:', error);
    }finally {
        setLoading(false);
      }
  };
  


  console.log('Unmarked Activity',activityData)
        
  const removeAll = async () => {
    try {
      await AsyncStorage.multiRemove(['activitydata','aridno']);
      console.log('clear all');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    removeAll();
    getStoredcourse();
    navigation.setOptions({ title: 'UnMarked'+' '+'Activities',backgroundColor:'red' ,
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    console.log('P_Id:', C_Id);
    console.log('Description:', CName);
    let obj = {
        Course_ID: C_Id,
        Teacher_ID:Username,
        Semester:Semester,
        Section:Section
      };
      getunmarkedactivities(obj);
  }, [C_Id,CName,Section,Semester]);
  return (
    <View style={styles.AppContainerActive}>
      <ScrollView>
        <View style={styles.Container}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#696969', textAlign: 'center', marginBottom: 10 }}>
                {CName}
              </Text>

              {activityData.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => movenextpage(item)}>
                  <View style={styles.Card}>
                    <Text style={styles.text1}> {item.Type}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.text} > Section: {item.Semester} {item.Section}</Text>
                      <Text style={styles.text}> {item.Type}: {item.Activity_No}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {!isLoading && activityData.length < 1 && (
          <View style={styles.NoData}>
            <Text style={styles.NotDataText}>You Have No data yet. Please Add Some!!!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default checkactivities;
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
   height: 55,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //top: -20,
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
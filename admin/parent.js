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

const parent = ({navigation,route}) => {
    const {Username} = route.params;
    
  
  const [studentData, setstudentData] = useState([]);
  const [isLoading, setLoading] = useState(true);
   
   
    
  ///get data from async
  const movenextpage=async(item)=>{
    AsyncStorage.setItem('aridno',item);  
       navigation.navigate('student')
  }
  const getAll = async () => {
    
  };
  
  /////////////////////////////----Fetch----////////////////////
  const getstudent = async () => {
    try {
        const response = await fetch(
          `${global.apiURL}/Transcript/parentdata?parentcnic=${Username}`,
        );
        const json = await response.json();
        setstudentData(json);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      } 
  };
  


  console.log('students',studentData)
        
  const removeAll = async () => {
    try {
      await AsyncStorage.multiRemove(['aridno']);
      console.log('clear all');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    removeAll();
   
    navigation.setOptions({
      title: 'Student',
      backgroundColor: 'red',
      headerStyle: {
        backgroundColor: 'green'
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white'
      },
    });
  
 
  getstudent();
  }, []);
  return (
    <View style={styles.AppContainerActive}>
      <ScrollView>
        <View style={styles.Container}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <View>
             

              {studentData.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => movenextpage(item.Arid_Number)}>
                  <View style={styles.Card}>
                    <Text style={styles.text1}> {item.Student_Name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.text} > Section: {item.Semester}{item.Section}</Text>
                      <Text style={styles.text}>   Arid_Number: {item.Arid_Number}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {!isLoading && studentData.length < 1 && (
          <View style={styles.NoData}>
            <Text style={styles.NotDataText}>You Have No data yet. Please Add Some!!!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default parent;
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
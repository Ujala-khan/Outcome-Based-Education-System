import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
//import { TextInput, DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';


const questionmarks = ({ navigation }) => {
   const [inputmarks, setinputmarks] = useState([]);
  const [CName, setCName] = useState('');
  const [Aridno, setAridno] = useState('');
  const [activityobtainmarks, setActivityObtainMarks] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getStoredCourse = async () => {
    try {
      const activityDataStr = await AsyncStorage.getItem('activitydata');
      const cname = await AsyncStorage.getItem('courseName');
      const aridno = await AsyncStorage.getItem('aridno');

      console.log('Stored object:', activityDataStr, cname);

      if (activityDataStr !== null && cname !== null && aridno !== null) {
        const parsedActivityData = JSON.parse(activityDataStr);

        console.log('Parsed object activityData:', parsedActivityData);
        console.log('Parsed object name:', cname);

        setCName(cname);
        setAridno(aridno);

        const obj = {
          Course_ID: parsedActivityData.Course_ID,
          Teacher_ID: parsedActivityData.Teacher_ID,
          Semester: parsedActivityData.Semester,
          Section: parsedActivityData.Section,
          Activity_No: parsedActivityData.Activity_No,
          Type: parsedActivityData.Type,
          Arid_Number:aridno
        };
        getUnmarkedStudent(obj);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };

  const getUnmarkedStudent = async (obj) => {
    try {
      console.log('object', obj);

      const response = await fetch(`${global.apiURL}/Activity/getCourseUnMarkedActivityagainstregno`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result, Aridno);
      //  const filteredStudents = filteAridno(result);
      //  setActivityObtainMarks(filteredStudents);
      setActivityObtainMarks(result);
      console.log('data ye ha', activityobtainmarks);
       
      } else {
        console.error('Request failed:', response.status);
      }
    } catch (error) {
      console.error('Request error:', error);
    } finally {
      setLoading(false);
    }
  };

  function filteAridno(result) {
    const uniqueStudents = result.filter((student, index, self) => {
     return index === self.findIndex((s) => s.Arid_Number === student.Arid_Number);
   });
   // const filteredActivityObtainMarks = result.filter(
    //  (item) => item.Arid_Number === Aridno
   // );
   // console.log('fff',filteredActivityObtainMarks);
   // setActivityObtainMarks(filteredActivityObtainMarks)
   return uniqueStudents;
  }
  const handleSave = async () => {
    try {
     
  //save data
      const response = await fetch(`${global.apiURL}/Activity/markActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputmarks),
      });
  
      if (response.ok) {
        Alert.alert('Marks saved successfully');
        navigation.navigate('studentdata')
      } else {
        console.error('Request failed:', response.status);
      }
    } catch (error) {
      console.error('Request error:', error);
    }
  };
  ////input marks list
  console.log("tList==", activityobtainmarks);
  const handleInputChange = (name, value, index) => {
  const list = [...activityobtainmarks];
   if (name == "Total_Marks") {
      list[index][name] = Number(value);
    } else {
      list[index][name] = value;
    }
    console.log("lList==", list);
    setinputmarks(list);
    console.log("lllllList==", inputmarks);
};
  useEffect(() => {
    getStoredCourse();
    navigation.setOptions({
      title: `Question Marks`,
      backgroundColor: 'red',
      headerStyle: {
        backgroundColor: 'green',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
    });
  }, [Aridno]);
  useEffect(() => {
    console.log('Activity Obtain Marks:', activityobtainmarks);
   // if (activityobtainmarks && activityobtainmarks.some(item => item.Obtained_Marks !== null)) {
    //  activityobtainmarks([]);
    //  setLoading(false);
     // console.log('activityobtainmarks contains items with Obtained_Marks');
  //  } else {
     // console.log('add Obtained_Marks');
   // }
  }, [activityobtainmarks]);
  
  return (
    <View style={styles.AppContainerActive}>
      <ScrollView>
        <View style={styles.Container}>
          {isLoading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#696969', textAlign: 'center', marginBottom: 5 }}>{CName}</Text>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#696', textAlign: 'center', marginBottom: 5 }}>{activityobtainmarks[0].Type} {activityobtainmarks[0].Activity_No}</Text>
                {activityobtainmarks.map((item, index) => (
                  <View key={index} style={styles.Card}>
                    <View style={{ width: 235 }}>
                      <Text style={styles.text}>Q_No:{item.Q_No} {item.Question}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: 100 }}>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="black"
                        name="Obtained_Marks"
                        value={item.Obtained_Marks}
                        style={{
                          height: 40,
                          marginTop: 5,
                          width: '35%',
                          marginLeft: 40,
                          borderWidth: 1,
                          borderColor: 'gray',
                          color: 'black',
                          borderRadius: 5,
                          padding: 10,
                          marginBottom: 10,
                        }}
                        onChangeText={(text) => handleInputChange('Obtained_Marks', text, index)}
                        required
                      />
                      <Text style={styles.text1}> /{item.Total_Marks}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {!isLoading && activityobtainmarks.length < 1 && (
          <View style={styles.NoData}>
            <Text style={styles.NotDataText}>You Have No data yet. Please Add Some!!!</Text>
          </View>
        )}

        <TouchableOpacity style={styles.DeleteButton} onPress={handleSave}>
          <Text style={styles.ButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


export default questionmarks;
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
   flexDirection: 'row',
    margin: 3,
    marginLeft:5,
  // height: 55,
   // width: 340,

    //marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
  },

 
  DeleteButton: {
    backgroundColor: '#5D9C59',
    height: 40,
    width: 300,
    marginLeft: 33,
    marginTop:8,
    marginBottom:10,
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
    fontSize: 16,
   // fontWeight: 'bold',
  },
  text1: {
    marginTop:7,
    color: 'black',
    fontSize: 18,
    //fontWeight: 'bold',
   // textAlign:'center'
  },
  NoData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  //  top: -50,
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
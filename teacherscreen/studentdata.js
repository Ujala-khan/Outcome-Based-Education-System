import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
TextInput,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
//import Icon from 'react-native-ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/FontAwesome';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
//import {TextInput, DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';
const studentdata = ({navigation,route}) => {
  const {data} = route.params;
   
    const[CName,setCName]=useState('')
 
  const [courseUnMarkedActivity, setcourseUnMarkedActivity] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);

  const [studentArid, setStudentArid] = useState([]);
  const [Question, setQuestion] = useState([]);
  const [courseUnMarkedQuestion, setCourseUnMarkedQuestion] = useState([]);
  console.log("courseUnMarkedQuestion", courseUnMarkedQuestion);

   
   
    
  ///get data from async
  const handleChange = (newValue,aridNo,Q_No) => {
    if (/^\d*$/.test(newValue)) {
     // handleWeightageChange(plosId, courseId, Number(newValue));
  //   const { name, value } = e.target;
    console.log("name", aridNo);
    const list = [...courseUnMarkedQuestion];
    let indexNo = list.findIndex((obj) => obj.Arid_Number == aridNo && obj.Q_No==Q_No);
    console.log("j", indexNo);
    if (indexNo !== -1) {
      const total = list[indexNo].Total_Marks;
      if (Number(newValue) > total) {
      Alert.alert("You  Enter  number less than  total");
        list[indexNo].Obtained_Marks = null;
       
        setCourseUnMarkedQuestion(list);
        console.log('obtain ',courseUnMarkedQuestion)
        console.log('total  hn',courseUnMarkedActivity)
      } else {
        list[indexNo].Obtained_Marks = Number(newValue);
        setCourseUnMarkedQuestion(list);
        console.log('obtain  hn',courseUnMarkedQuestion)
        console.log('total  hn',courseUnMarkedActivity)
      }
    }
    }
  };
  
  const addactivity = async () => {
  
 
    
    try {
    
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',courseUnMarkedQuestion)
fetch(`${global.apiURL}/Activity/markActivity`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(courseUnMarkedQuestion)
})
.then(response => response.json())
.then(res => Alert.alert('', res))
  .catch((error) => {
    console.error(error);
  });

    } catch (error) {
      console.error(error);
    } 
 
  };
  const getStoredcourse = async () => {
    try {
      const activityDataStr = await AsyncStorage.getItem('activitydata');
      const cname = await AsyncStorage.getItem('courseName');

      console.log('Stored object:', activityDataStr, cname);

      if (activityDataStr !== null && cname !== null) {
        const parsedActivityData = JSON.parse(activityDataStr);

        console.log('Parsed object activityData:', parsedActivityData);
        console.log('Parsed object name:', cname);

        setCName(cname);
        setActivityData(parsedActivityData);

        console.log('State variables:', parsedActivityData, CName);
        const obj = {
          A_Id: parsedActivityData.A_Id,
            Course_ID: parsedActivityData.Course_Id,
            Teacher_ID: parsedActivityData.Teacher_ID,
            Semester: Number(parsedActivityData.Semester),
            Section: parsedActivityData.Section,
            Activity_No: parsedActivityData.Activity_NO,
            Type: parsedActivityData.Type,
          };
          getUnmarkedStudent(obj)
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };

  const getUnmarkedStudent = async (obj) => {
    try {
   
       

        console.log('object', obj);

        const response = await fetch(`${global.apiURL}/Activity/getCourseUnMarkedActivity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        });

        if (response.ok) {
          const result = await response.json();
         // const uniqueStudents = result.filter((student, index, self) => {
           // return index === self.findIndex((s) => s.Arid_Number === student.Arid_Number);
         // });
     setcourseUnMarkedActivity(result);
          console.log(result);
        } else {
          console.error('Request failed:', response.status);
        
      }
    } catch (error) {
      console.error('Request error:', error);
    } finally {
      setLoading(false);
    }
  };
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
    const obj = {
      A_Id: data.A_Id,
        Course_ID: data.Course_Id,
        Teacher_ID: data.Teacher_ID,
        Semester: Number(data.Semester),
        Section: data.Section,
        Activity_No: data.Activity_NO,
        Type:data.Type,
      };
      console.log(obj);
      getUnmarkedStudent(obj)
  
    navigation.setOptions({
      title: `Enter Marks`,
      backgroundColor: 'red',
      headerStyle: {
        backgroundColor: 'green',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
      },
    });

    console.log('Activity Data:', courseUnMarkedActivity);

   
  }, []);
  
  useEffect(() => {
    const uniqueStudent = courseUnMarkedActivity?.reduce((acc, curr) => {
      const existingPair = acc.find(
        (pair) => pair.Arid_Number === curr.Arid_Number
      );
      if (!existingPair) {
        acc.push({
          ...curr,
        });
      }
      return acc;
    }, []);

    const uniqueQuestion = courseUnMarkedActivity?.reduce((acc, curr) => {
      const existingPair = acc.find((pair) => pair.Q_No === curr.Q_No);
      if (!existingPair) {
        acc.push({
          ...curr,
        });
      }
      return acc;
    }, []);
    setStudentArid(uniqueStudent);
    setQuestion(uniqueQuestion);
    let temp = [];
console.log('yaha',courseUnMarkedActivity)
    courseUnMarkedActivity.forEach((obj) => {
      let obj1 = {
        ...obj,
        Obtained_Marks: null,
      };
      temp.push(obj1);
    });
    setCourseUnMarkedQuestion(temp);
  }, [courseUnMarkedActivity,activityData]);

  const handleInputChange = (e, aridNo) => {
    const { name, value } = e.target;
    console.log("name", aridNo);
    const list = [...courseUnMarkedQuestion];
    let indexNo = list.findIndex((obj) => obj.Arid_Number == aridNo);
    console.log("j", indexNo);
    if (indexNo !== -1) {
      const total = list[indexNo].Total_Marks;
      if (Number(value) > total) {
        toast.warn("You  Enter  number less than  total");
        list[indexNo].Obtained_Mark = null;
        setCourseUnMarkedQuestion(list);
      } else {
        list[indexNo].Obtained_Mark = Number(value);
        setCourseUnMarkedQuestion(list);
      }
    }
  };
  return (

  
    <View style={
       styles.AppContainerActive
    }
    
    >
     
     
      <View style={styles.Container}>
        {isLoading ? (
           <ActivityIndicator size={'large'} />
           ) : (
             <View>
               <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#696969', textAlign: 'center', marginBottom: 10 }}>{data.Type}</Text>
               <ScrollView horizontal={true}>
               <View>
               <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row

                             data={['  AridNo# ', ...Question.map((ques) => [ <View >
                              <Tooltip
                    popover={<Text>{ques?.Question1}</Text>}
                    height={null}
                    skipAndroidStatusBar={true}
                  >
             <Text  style={styles.text1 }> Q{ques?.Q_No}/({ques?.Total_Marks})</Text>
             </Tooltip>  
              </View>])]}
                             widthArr={[140,  ...Array(Question.length).fill(51)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                       
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows
              style={styles.ROWTABLE}
                                    widthArr={[140,  ...Array(Question.length).fill(51)]}
                          
              data={[
               ,
                ...studentArid?.map((arid) => [
                  <View style={styles.viewCell}>
                    <Text style={styles.text}>{
                  arid?.Arid_Number}
                  </Text>
                  </View>
                ,
                  ...Question.map((ques) => {
                    const dataObtain = courseUnMarkedQuestion?.find(
                      (obj) =>
                        obj?.Q_No === ques.Q_No &&
                        obj?.Arid_Number === arid?.Arid_Number
                    );
                    console.log("dataObtain", dataObtain);
                    return (
                      <TextInput
                      style={styles.input}
                      value={  dataObtain?.Obtained_Marks !==
                        undefined &&
                      dataObtain?.Obtained_Marks !== null
                        ? dataObtain.Obtained_Marks
                        : 0}
                     onChangeText={(newValue) => handleChange(newValue,dataObtain?.Arid_Number,dataObtain?.Q_No)}
                      //onBlur={()=> handleWeightageChange(plos.Plo_Id, course.C_Id, Number(value))}
                     // name={`cell-${plos.Plo_Id}-${course.C_Id}`}
                      keyboardType="numeric"
                    />
                    );
                  }),
                ]),
              ]}
              textStyle={styles.text}
              //widthArr={[100, ...Array(PLOsData.length).fill(70)]}
             
            />
           
                        </Table>
                    </ScrollView>
               </View>
               </ScrollView>
             </View>
           )}
           <TouchableOpacity style={styles.Button}  onPress={addactivity}>
  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:15}}>Save Marks</Text>
</TouchableOpacity>
              
         </View>
       
       {!isLoading && courseUnMarkedActivity.length < 1 && (
         <View style={styles.NoData}>
           <Text style={styles.NotDataText}>
             You Have No data yet. Please Add Some!!!
           </Text>
         </View>
       )}
     </View>
   );
 };
 
export default studentdata;
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

  
 
  NotDataText: {
    color: 'white',
    backgroundColor: '#eea52d',
    padding: 20,
    fontSize: 16,
    borderRadius: 15,
  },
 
  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44, backgroundColor: '#3cb371' },
  ROWTABLE: { height: 42,  },
  input:{color:'black', height: 42,fontSize:12},
  headText: { fontSize: 16,  color: 'white' },
  text: { margin: 6, fontSize: 16, fontWeight: 'bold'  ,color:'black'},
  text: { margin: 7, fontSize: 16, fontWeight: 'bold'  ,color:'white'},
  EditButton: {
    backgroundColor: '#4E944F',
    height: 40,
    marginLeft:20,
    width: '90%',
   marginTop:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:  'bold',
  },
  fixedCell: {
    backgroundColor: '#f8d7',
    color: 'red',
  },
  NoData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
  },
  NotDataText: {
    color: 'white',
    backgroundColor: '#eea52d',
    padding: 20,
    fontSize: 16,
    borderRadius: 15,
  }
  ,
   tooltipCell: {
    backgroundColor: '#3cb371',
    paddingHorizontal: 8,
    paddingVertical: 4,
   height:49,
  },
  text1: {
    
    color: 'white',
    fontSize: 13,
    //marginTop:10,
    fontWeight: 'bold',
  },
 viewCell:{
  height:42,
  backgroundColor:'#3cb371'
 },
 Button: {
  borderRadius: 20,
  padding: 10,
  elevation: 2,
  backgroundColor: '#49c658',
  width: 160,
  marginTop:'35%',
  alignSelf: 'center',
},

  
    
});
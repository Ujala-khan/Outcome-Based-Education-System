import React, { useState ,useEffect} from 'react';
import { StyleSheet, View ,ScrollView,Text,Alert,TouchableOpacity,AsyncStorage,Modal,Pressable} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';

import { Tooltip } from 'react-native-elements';
import {TextInput} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';        
                                                                                                                                             
const Show_CLOs_activity_Mapping= ({navigation}) => {
  const [cloactivityData, setcloactivityData] = useState([]);
  const [typeName, setTypeName] = useState([]);
  const[C_Id,setC_Id]=useState('')
 const[CName,setCName]=useState('')
 const[suggustion,setsuggustion]=useState('');
 const [modalVisible, setModalVisible] = useState(false);
  const [plosName, setPlosName] = useState([]);
  const [closName, setClosName] = useState([]);
  const [weights, setWeights] = useState([]);
  const addSuggustion= () => { 
    try {
    
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',C_Id)
      const apiUrl = `${global.apiURL}/ActivityMappingCLOs/suggestionMappingActivityonCLO?courseID=${C_Id}&suggestion=${suggustion}`;
      
   const requestOptions = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ courseID: C_Id,
      suggestion:suggustion
     }),
   };
   fetch(apiUrl, requestOptions)
     .then((response) => {
       if (response.ok) {
         // Request successful, handle the response here
         Alert.alert('Add suggustion successfully');
         console.log('API request successful');
       } else {
         // Request failed, handle the error here
         console.log('API request failed');
       }
     })
     .catch((error) => {
       // Network or other errors occurred, handle them here
       console.error('Error occurred during API request:', error);
     });
      setModalVisible(!modalVisible);
      setsuggustion('');
           
     
    } catch (error) {
      console.error(error);
    }
  };
  
  const approvemapping = async () => {
  
 
    
    try {
    
     console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',C_Id)
     const apiUrl =`${global.apiURL}/ActivityMappingCLOs/approvalMappinAtivitiesonCLOs?courseID=${C_Id}`;
     
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseID: C_Id }),
  };
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (response.ok) {
        // Request successful, handle the response here
        Alert.alert('Approved')
        console.log('API request successful');
      } else {
        // Request failed, handle the error here
        console.log('API request failed');
      }
    })
    .catch((error) => {
      // Network or other errors occurred, handle them here
      console.error('Error occurred during API request:', error);
    });

    navigation.navigate('program');

  } catch (error) {
    console.error(error);
 } 

 
  };
  
  const getStoredcourse = async () => {
    try {
      const cid= await AsyncStorage.getItem('coursID');
      const cname= await AsyncStorage.getItem('courseName');
      console.log('Stored object:', cid,cname);
      if (cid !== null && cname!==null) {
       
        console.log('Parsed object cid:', cid);
        console.log('Parsed object name:', cname);
        setC_Id(cid);
        setCName(cname);
        
        console.log('State variables:', C_Id, CName);
      //  GetAll(cid);
       
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };

  
  
  const GetAll = async (Id) => {
    try {
      console.log('manhos id',C_Id)
      const response = await fetch(
        `${global.apiURL}/ActivityMappingCLOs/GetAllActivityCLOsMapping?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();
console.log("datainner",data)
     setcloactivityData(data);
     
    } catch (error) {
      console.error(error);
    } 

  };
  console.log('dataouter',cloactivityData)
  

    // useEffect(()=>{
    //   GetAll(C_Id);
    // },[C_Id])

  useEffect(async () => {
    
    
    const cid= await AsyncStorage.getItem('CourseID');
    const cname= await AsyncStorage.getItem('CourseName');
      console.log('Stored object:', cid,cname);
      if (cid !== null && cname!==null) {
       
       GetAll(cid);
       setC_Id(cid)
       setCName(cname);
     
       
      }
    
    navigation.setOptions({ title:'CLOActivity Mapping',
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    
   
    
   
    
  }, []);
  useEffect(()=>{
    const uniqueType = cloactivityData.reduce((acc, curr) => {
      const existingPair = acc.find((pair) => pair.Type === curr.Type);
      if (!existingPair) {
        acc.push({ Type: curr.Type });
      }
      return acc;
    }, []);
   
    const uniqueClos = cloactivityData.reduce((acc, curr) => {
      const existingPair = acc.find((pair) => pair.Name === curr.Name);
      if (!existingPair) {
        acc.push({ Name: curr.Name });
      }
      return acc;
    }, []);
    setClosName(uniqueClos);
    console.log('cloname',closName);
    setTypeName(uniqueType);
    setWeights(cloactivityData);
  },[cloactivityData])



 
    
    return (
      <View style={styles.container}>
             <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#696969',textAlign:'center',marginBottom:10 }}>{CName}</Text>
           <ScrollView horizontal={true}>
        
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row
                             data={['C/A', ...closName.map((clos) => clos.Name)]}
                             widthArr={[100,  ...Array(closName.length).fill(44)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows 
                                    widthArr={[100,  ...Array(closName.length).fill(44)]}
                          
              data={[
               ,
                ...typeName?.map((activity) => [ <View style={styles.tooltipCell }>
                  <Text style={styles.text1 }> {activity.Type}</Text>  
                   </View>, 
                
                  
                    ...closName?.map((clos) => {
                        const weight = weights.find(
                          (weight) =>
                            weight.Type === activity.Type && weight.Name === clos.Name
                        );
                        console.log('weight',weight)
                    return weight?.Weightage !== undefined && weight?.Weightage !== 0 ? `${weight.Weightage}%` : '';
                   
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
            
<View style={{ flexDirection: 'row' }}>  
  <TouchableOpacity style={[styles.EditButton, { marginRight: 10 }]} onPress={()=>approvemapping(weights)}>
    <Text>Approve</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.EditButton]} onPress={() => setModalVisible(true)}>
    <Text>Suggestion</Text>
  </TouchableOpacity>
</View>
<Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
         onRequestClose={() => {
         
            setModalVisible(!modalVisible);
            
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Pressable
                style={styles.modalButton2}
                onPress={() => {
                  setModalVisible(!modalVisible);}}>
                <MaterialCommunityIcons name="close-thick" size={25} color="black"/>
              </Pressable>
              <Text style={styles.ModalHeaderText}>ADD Suggeston</Text>

              <TextInput
                style={styles.InputFields}
                multiline={true}
                mode="outlined"
                label="Sugguston"
                value={suggustion}
                onChangeText={newText => {
                  setsuggustion(newText);
                }}
              />

             
              <Pressable
                style={styles.modalButton}
                onPress={() => addSuggustion()}>
                <Text style={styles.textStyle}>ADD</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff' },
  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44, backgroundColor: '#3cb371' },
  input:{color:'black'},
  headText: { margin:2,fontSize: 16, fontWeight:'bold', color: 'white' },
  text: { margin: 6, fontSize: 16  ,color:'black'},
  EditButton: {
    backgroundColor: 'green',
    height: 40,
    marginLeft:10,
    width: '40%',
   marginTop:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
  ,
   tooltipCell: {
    backgroundColor: '#3cb371',
    paddingHorizontal: 8,
    paddingVertical: 4,
   height:53,
  },
  text1: {
    
    color: 'white',
    fontSize: 14,
    marginTop:10,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: 320,
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ModalHeaderText: {
    alignSelf: 'center',
    borderRadius: 20,
    width: 150,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
    backgroundColor: '#49c658',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#49c658',
    width: 70,
    alignSelf: 'flex-end',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  InputFields: {
    height: '25%',
    width: '90%',
    marginBottom: 10,
  },
 
     
  modalButton2: {
    borderRadius: 20,
    elevation: 2,
    alignSelf: 'flex-end',
  }
});
export default Show_CLOs_activity_Mapping
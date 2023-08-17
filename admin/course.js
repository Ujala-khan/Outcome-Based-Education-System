import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
//import Icon from 'react-native-ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Icon from 'react-native-vector-icons/FontAwesome';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {TextInput, DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { set } from 'react-native-reanimated';
import { Tooltip } from 'react-native-elements';

const course = ({navigation,route}) => {
 
 const[Title,setTitle]=useState('')
 const[Description,setDescription]=useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [courseData, setcourseData] = useState([]);
  const [modaltitle, setmodeltitle] = useState('ADD Course');
 
  const [id, setid] = useState('');
  const [buttonTitle,setButtonTitle]=useState('Add')
  
  const [isLoading, setLoading] = useState(true);
  const[session,setsession]=useState(null)
  const[P_Id,setP_Id]=useState(null)
    const[c_code,setc_code]=useState(null)
    const[title,settitle]=useState(null)
    const[Credit_Hour,setcredit_Hour]=useState(null)
    
     
  function moveclo(name,id){
    console.log('dataaa',name,'id',id);
    AsyncStorage.setItem('courseName',name); 
    
    AsyncStorage.setItem('coursID',JSON.stringify(id));  
    navigation.navigate('courseclotab')
  }
    
    
    const getStoredprogram = async () => {
      try {
        const storedObject = await AsyncStorage.getItem('program');
        const sessionName = await AsyncStorage.getItem('Session');
        
        
        console.log('Stored object:', storedObject);
        if (storedObject !== null || sessionName!==null) {
          const parsedObject = JSON.parse(storedObject);
          console.log('Parsed object:', parsedObject);
        setsession(sessionName)
          setP_Id(parsedObject.P_Id);
          setDescription(parsedObject.Description);
          setTitle(parsedObject.Title);
          console.log('State variables:', P_Id, Description, Title,session);
        }
      } catch (e) {
        console.log('Error getting stored object:', e);
      }
    };
    
    
  //upload courses
  async function sendExcelFileToApi() {

    if (Platform.OS === 'android') {
      // Calling the permission function
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Example App Camera Permission',
          message: 'Example App needs access to your camera',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission Granted
        proceed();
      } else {
        // Permission Denied
        alert('CAMERA Permission Denied');
      }
    } else {
      proceed();
    }


  }
  async function proceed() {
    try {
      // Allow the user to select an Excel file
      const excelFile = await DocumentPicker.pick({

      });

      console.log(excelFile)
   let uri=excelFile[0].uri;
   let type=excelFile[0].type;
   let name=excelFile[0].name;
      //let uri = excelFile.uri.split(':')[1]
     // console.log(`http://${IP}/biit_lms_api/api/Admin/loadCourses`)
      // Create a FormData object to send the file to the API
      //'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const formData = new FormData();
      formData.append('programId', P_Id);
      formData.append('session', session);
      formData.append('courseAllocationFile', {
        uri: uri,
        type:type,
        name: name,
      });
console.log('kkkk',excelFile[0].uri)
console.log('formdata',formData)
      let url = `${global.apiURL}/AllocationCourse/AddCoursesAllocation`
      // Send the request to the API endpoint
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,

      });
    
      // Handle the API response as required
      const result = await response.json();
      console.log(result);
      Alert.alert('', result)
    } catch (error) {
      console.log(error);
    }
  }

  /////UPDATE
  const update = () => {
   
    try {
      fetch(`${global.apiURL}/Course/UpdateCourse`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          C_Id:id,
          C_Code:c_code,
          Name: title,
          Credit_Hour: Credit_Hour,
          Program_Id:P_Id,
          sessionName:session,
         
        }),
      })
        .then((response) => response.json())
        .then((res) => Alert.alert('', res))
        .then(() => {
          setModalVisible(!modalVisible);
          setButtonTitle('Add');
          setmodeltitle('ADD Course')
          settitle('');
          setcredit_Hour('')
          setc_code('')
          
          getAll();
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };


  /////////////////////////////----Fetch----////////////////////
  const getAll = async () => {
    try {
      console.log(P_Id)
      const response = await fetch(
        `${global.apiURL}/Course/GetCoursesProgram?Program_Id=${P_Id}&session=${session}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      setcourseData(data);
      console.log('data courses',data)
      console.log('data courses3',courseData)
      setLoading(false)
     
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
/////////////////////////////----chANGE BUTTON--------------/////
  function save(){
   
  if(buttonTitle==='Add'){
      addcourse()
    }
    else if(buttonTitle==='Update'){
     
      setc_code(c_code);
      settitle(title);
      setcredit_Hour(Credit_Hour);
      console.log(title)
      console.log(Credit_Hour)
     
  update()
  }
  
  }

  /////////////////////////////----Delete User----////////////////////

  const deleteData =(id)=> {
    fetch(
      `${global.apiURL}/Course/DeleteCourse`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          C_Id:id,
          C_Code:c_code,
          Name: title,
          Credit_Hour: Credit_Hour,
          Program_Id:P_Id,
          sessionName:session,
        
        }),
      },
    )
      .then(response => response.json())
      .then(res => Alert.alert('', res));

    getAll();
  };

  /////////////////////////////----Update User----////////////////////
  const addcourse = () => {
  
    try {
      fetch(
        `${global.apiURL}/Course/InsertCourse`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            C_Id:id,
            C_Code:c_code,
            Name: title,
            Credit_Hour: Credit_Hour,
            Program_Id:P_Id,
            sessionName:session
          
          }),
        },
      )
      .then(response => response.json())
      .then(res => Alert.alert('', res));
      setModalVisible(!modalVisible);
      settitle('');
      setcredit_Hour('')
      setc_code('')
      getAll();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStoredprogram();
    navigation.setOptions({ 
      title: Title ? Title + '   ' + 'Courses' : 'Loading...', 
    
      backgroundColor: 'red',
      headerStyle: {
        backgroundColor: 'green'
      }, 
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white' 
      },
     
      
    });
    console.log('P_Id:', P_Id);
    console.log('Description:', Description);
    console.log('Title:', Title);
    console.log('session:', session);
    getAll();
  }, [P_Id, Description, Title,session]);
  useEffect(()=>{
    if(courseData.length>0){
      console.log('courses',courseData)
    }
  },[courseData])
  
  return (

  
    <View style={
      modalVisible ? styles.AppContainerDisable : styles.AppContainerActive
    }
    
    >
      
   
      <View style={styles.Container}>
        {isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
        
          <View>
       
     
         
                <View>
                <View style={styles.Card1}>
                  <Text style={{color:'black',marginTop:15,marginLeft:3,
                    fontWeight: 'bold',fontSize:15}}>Name</Text>
                  <Text style={{color:'black',marginLeft:35,marginTop:15,  fontWeight: 'bold',fontSize:15}}>Credit_Hour</Text>
                  <Text style={{color:'black' ,marginLeft:10,marginTop:15,  fontWeight: 'bold',fontSize:15}}> ADD CLOs</Text>
                  <Text style={{color:'black',marginLeft:25,marginTop:15, fontWeight: 'bold',fontSize:15}}>Action</Text>


                </View>
      
     
           <FlatList
           keyExtractor={(item, index) => index.toString()}
      data={courseData}
      //horizontal
      //inverted
      renderItem={({ item ,index}) => (
 
      
        <View key={index} style={styles.Card}>
          <View style={{width:70,marginTop:15,marginLeft:3,}}>
        
          <Tooltip
              popover={<Text>{item.Name}</Text>}
              withPointer={false}
              height={null}
              skipAndroidStatusBar={true}
            >
        <Text numberOfLines={1} style={styles.text}>
          {item.Name}
        </Text>
        </Tooltip>
           </View>
           
          <View style={{width:50,margin:15}}>
          <Text style={styles.text}>{item.Credit_Hour}</Text></View>
          
          <TouchableOpacity
              style={styles.DeleteButton}
              onPress={()=>moveclo(item.Name,item.C_Id)}>
              <Text style={styles.ButtonText}>CLOs</Text>
            </TouchableOpacity>
            <View style={styles.EditButton}>
          <TouchableOpacity
     
        onPress={() => {
          setButtonTitle('Update');
          setmodeltitle('Update Course')
          setid(item.C_Id);
          setc_code(item.C_Code);
          settitle(item.Name);
          setcredit_Hour(item.Credit_Hour);
          setModalVisible(true);
        }}>
        <Icon name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
    style={{marginLeft:10}}
        onPress={() => deleteData(item.C_Id)}>
        <Icon name="trash-o" size={20} color="#fff" />
      </TouchableOpacity>
           
          
      </View>
        </View>
      )}
    
      />
      
       </View>
                 
            
          </View>
         

        )}
      
      </View>
 
      {!isLoading && courseData.length < 1 && (
        <View style={styles.NoData}>
          <Text style={styles.NotDataText}>
            You Have No data yet. Please Add Some!!!
          </Text>
          <TouchableOpacity style={[styles.EditButton1]} onPress={sendExcelFileToApi}>
        <View style={{flexDirection: 'row',}}>
        <MaterialCommunityIcons name="file-upload" size={25} color="white"/>
        <Text style={{marginLeft:2,fontWeight:'bold',marginTop:3}}>Upload Courses</Text></View>
      </TouchableOpacity>
        </View>
      )}

      <View style={styles.centeredView}>
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
                 <Icon name="remove" size={20} color="black" />
              </Pressable>
              <Text style={styles.ModalHeaderText}>{modaltitle}</Text>

              <TextInput
                style={styles.InputFields}
                mode="outlined"
                label="Course_Code"
                value={c_code}
                onChangeText={newText => {
                  setc_code(newText);
                }}
              />
              
              <TextInput
                style={styles.InputFields}
                mode="outlined"
                label="Name"
                value={title}
                onChangeText={newText => {
                  settitle(newText);
                }}
              />
              
              <TextInput
                style={styles.InputFields}
                mode="outlined"
                label="Credit_Hour"
                value={Credit_Hour}
                onChangeText={newText => {
                  setcredit_Hour(newText);
                }}
              />

              
                <View style={{ flexDirection: 'row' }}>
                {buttonTitle === 'Add' && (
   <TouchableOpacity
             
   style={styles.modalButton1}
   onPress={()=>{ navigation.navigate('precourse',{   P_Id: P_Id,sessionName:session})}}>
   <Text style={styles.textStyle1}>select from prevoius program</Text>
 </TouchableOpacity>
)}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => save()}>
                <Text style={styles.textStyle}>{buttonTitle}</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.bottomView}>
      <TouchableOpacity
             onPress={() => {
              setModalVisible(!modalVisible);}}>
            <Icon name="plus-circle" size={40} color="green" />
            </TouchableOpacity>
        </View>
      
    </View>
  
  );
};

export default course;
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
    borderColor: 'black',
    
    borderWidth: 1,
    
    height: 50,
  
    flexDirection: 'row',
  
  },
  
  Card1: {
    borderColor: 'black',
    
    borderWidth: 1,
    backgroundColor: '#2e8b57',
    height: 50,
  
    flexDirection: 'row',
  
  },

  CardButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  EditButton: {
    flexDirection: 'row',
    backgroundColor: 'green',
    height: 30,
    width: 80,
    marginTop:10,
    marginLeft: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  EditButton1: {
    flexDirection: 'row',
    backgroundColor: 'green',
    height: 50,
    width: '60%',
    marginTop:10,
    marginLeft: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DeleteButton: {
    backgroundColor: 'green',
    height: 30,
    width: 60,
    marginTop:10,
    marginLeft: 5,
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
    top: -50,
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
  modalView: {
    height: 400,
    width: 250,
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
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#49c658',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    marginLeft:10,
    elevation: 2,
    backgroundColor: '#49c658',
    width: 70,
    alignSelf: 'flex-end',
  },
  modalButton2: {
    borderRadius: 20,
    
   
    elevation: 2,
   
    
    alignSelf: 'flex-end',
  },
  modalButton1: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#49c658',
    width: 130,
    alignSelf: 'flex-end',
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

  InputFields: {
   // height: '0%',
    width: '90%',
    marginBottom: 10,
  },
  InputFields1: {
   height: '25%',
    width: '90%',
    marginBottom: 10,
  },
     bottomView: {
    width: '100%',
    height: 40,
   // backgroundColor: '#EE5407',
    justifyContent: 'center',
   
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
    alignSelf: 'flex-end',
    marginLeft:'90%',
    
  }, row: {
    flexDirection: 'row',
    padding: 10,
  },
 
});

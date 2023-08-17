import React,{useEffect,useState} from 'react';
import { Button, TouchableOpacity, View ,AsyncStorage,Alert,StyleSheet,Modal,Pressable,Text,PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuItem } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { Badge } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-paper';
export default function Header() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [user, setuser] = useState('');
  const [Role, setRole] = useState('');
  const [notificationList, setnotificationList] = React.useState([]);
  const[session,setsession]=useState(null)
  //console.log('old data',notificationList)
  
  async function sendExcelFileToApi(filename) {

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
        if(filename==='Register_Student'){
          console.log('Register_Student');
        proceed();}
        else{
          console.log('Register_Student');
          Enroll_Studentdata();
        }
      } else {
        // Permission Denied
        alert('CAMERA Permission Denied');
      }
    } else {
      if(filename==='Register_Student'){
        console.log('Register_Student');
      proceed();}
      else{
        console.log('Register_Student');
        Enroll_Studentdata();
      }
    }


  }
  ///Register student
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
     
      formData.append('StudentsFile', {
        uri: uri,
        type:type,
        name: name,
      });
console.log('kkkk',excelFile[0].uri)
console.log('formdata',formData)
      let url = `${global.apiURL}/StudentsFile/UploadStudents`
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
  /// student enroll
  async function Enroll_Studentdata() {
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
     
      formData.append('EnrollmentFile', {
        uri: uri,
        type:type,
        name: name,
      });
console.log('kkkk',excelFile[0].uri)
console.log('formdata',formData)
      let url = `${global.apiURL}/Enrollment/EnrollStudents`
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
  //add session
  const addSession = () => {
  
    try {
      fetch(
        `${global.apiURL}/Session/InsertSession`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionName: session,
          
           
          }),
        },
      )
      .then(response => response.json())
      .then(res => Alert.alert('', res));
      setModalVisible(!modalVisible);
      setsession('');
           
     
    } catch (error) {
      console.error(error);
    }
  };

  const Handlemodel = () => {
    setVisible(false);
    setModalVisible(true);
   
  };
  const hideMenu = () => {
   // onLogout();
    navigation.reset({ index: 0, routes: [{ name: 'login' }] });
    setVisible(false);
  };

  const showMenu = () => setVisible(true);
  const getAll = async () => {
    try {
   
      const response = await fetch(
        `${global.apiURL}/Notifications/GetAllCLOsPLOsMappingPending`,
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
      const role= await AsyncStorage.getItem('Role');
      console.log('user:', User);
      if (User!== null ) {
        setuser(User);
        setRole(role);
        console.log('User 1:', User);
        if(User==='admin'){
          console.log('list is empty',notificationList.length)
        getAll();
        }else{
          getAllteachernotification(User);
        }
       
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    } 
  };
  

  useEffect(() => {
    getStoreduser();
  }, []);
  
  useEffect(() => {
    if (user === 'admin') {
      getAll();
      console.log('notification',notificationList)
    }
  }, [user]);
  useEffect(() => {
    if (notificationList.length > 0) {
      // Force a re-render when the length of notificationList changes
      // to update the badge display
      console.log('notificationList length:', notificationList.length);
    }
  }, [notificationList]);
  
  return (
  
    <View style={{ flexDirection: 'row' }}>
{user==='admin' || Role==='teacher'&&(
     <TouchableOpacity
      style={{ marginRight: 20 }}
      onPress={() => navigation.navigate('Notifications')}
    >
      <Icon name="bell" size={24} color={'white'} />

      {notificationList.length >0 && (
        <Badge
          value={notificationList.length}
          status="error"
          containerStyle={{ position: 'absolute', top: -4, right: -4 }}
        />
      )}
    </TouchableOpacity>)}
      <Menu
        visible={visible}
        style={{ backgroundColor: 'gray' }}
        anchor={
          <TouchableOpacity style={{ marginRight: 6 }} onPress={showMenu}>
            <Icon name="ellipsis-v" size={24} color={'white'} />
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
      >
        {user==='admin'&&(
          <>
        <MenuItem onPress={Handlemodel}>Session</MenuItem>
        <MenuItem onPress={()=>{sendExcelFileToApi('Enroll_Student')}}>Enroll_Student</MenuItem>
        <MenuItem onPress={()=>{sendExcelFileToApi('Register_Student')}}>Register_Student</MenuItem>
        </>
        )}
        <MenuItem onPress={hideMenu}>Logout</MenuItem>
      </Menu>
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
              <Text style={styles.ModalHeaderText}>ADD Session</Text>

              <TextInput
                style={styles.InputFields}
                mode="outlined"
                label="eg 2022-FALL || 2022-Spring"
                value={session}
                onChangeText={newText => {
                  setsession(newText);
                }}
              />

             
              <Pressable
                style={styles.modalButton}
                onPress={() => addSession()}>
                <Text style={styles.textStyle}>ADD</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
    </View>
   
 
  );
 
}
const styles = StyleSheet.create({
  
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
   // height: '0%',
    width: '90%',
    marginBottom: 10,
  },
 
     
  modalButton2: {
    borderRadius: 20,
    elevation: 2,
    alignSelf: 'flex-end',
  }
 
});

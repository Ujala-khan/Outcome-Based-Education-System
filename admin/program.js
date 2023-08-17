import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
 AsyncStorage,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {TextInput} from 'react-native-paper';

const program = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [programData, setprogramData] = useState([]);
  
  const [isLoading, setLoading] = useState(true);
    const[title,settitle]=useState(null)
    const[description,setdescription]=useState(null)
    const [sessionlist, setSessionlist] = useState([]);
    const [session, setSession] = useState(null);

    function movecourse(item){
      AsyncStorage.setItem('program',JSON.stringify(item));  
      AsyncStorage.setItem('Session',session);  
      navigation.navigate('courseplotab', { screen: 'course' })
    }
    
    function moveplo(item){
      AsyncStorage.setItem('program',JSON.stringify(item));  
      AsyncStorage.setItem('Session',session);  
      navigation.navigate('courseplotab', { screen: 'plo'})
    }
    
    function moveallocation(item){
      AsyncStorage.setItem('program',JSON.stringify(item));  
      AsyncStorage.setItem('Session',session);  
      navigation.navigate('courseplotab', { screen: 'allocation'})
    }
    
    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage successfully cleared!');
      } catch (e) {
        console.log('Failed to clear AsyncStorage:', e);
      }
    };
  const HandleEdit = () => {
  
    setModalVisible(true);
  };
  /////////////////////////////----Fetch Session----////////////////////
  const getAllsession = async () => {
    try {
      const response = await fetch(`${global.apiURL}/Session/GetAllSession`);
      const json = await response.json();
      const sortedData = json.sort((a, b) => new Date(b.date) - new Date(a.date));

    setSessionlist(sortedData);
      console.log('session data', json);
    } catch (error) {
      console.error(error);
    }
  };
  

  /////////////////////////////----Fetch----////////////////////
  const getAll = async () => {
    try {
      const response = await fetch(
        `${global.apiURL}/Program/GetAllPrograms`,
      );
      const json = await response.json();
      setprogramData(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////////----Delete User----////////////////////

  const deleteData = id => {
    fetch(
      `${global.apiURL}/employees/DeleteEmployee/${id}`,
      {
        method: 'Delete',
      },
    )
      .then(response => response.json())
      .then(res => Alert.alert('', res));

    getAll();
  };

  /////////////////////////////----Update User----////////////////////
  const addProgram = () => {
  
    try {
      fetch(
        `${global.apiURL}/Program/InsertProgram`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Title: title,
            Description: description,
           
          }),
        },
      )
      .then(response => response.json())
      .then(res => Alert.alert('', res));
      setModalVisible(!modalVisible);
      settitle('');
      setdescription('')
      getAll();
    } catch (error) {
      console.error(error);
    }
  };
  const removeAll = async () => {
    try {
      await AsyncStorage.multiRemove(['program', 'courseName','coursID','CourseName','CourseID','semester'
      ,'section','activitydata','aridno','Session']);
      console.log('clear all');
    } catch (error) {
      console.error(error);
    }
  };

  
  
  const handleTypeChange = (value) => {
    console.log('value',value)
    
  setSession(value)
   
  };
  
  
  
  

  useEffect(() => {
    navigation.setOptions({ 
      title:'Program' , 
     
      headerStyle: {
        backgroundColor:'#228b22',
       
      }, 
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white' ,

      },
    });
    removeAll();
    getAll();
    getAllsession();
    
  }, []);
  useEffect(()=>{
    if(sessionlist.length>0){
      console.log('ssesion h',sessionlist)
    }}, [sessionlist]);
    useEffect(() => {
     
      if (session != null) {
      console.log(session)
       
      }
    }, [session]);
  return (

  
    <View style={
      modalVisible ? styles.AppContainerDisable : styles.AppContainerActive
    }
    >
         
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
        ) : (
        
          <View>
      
     
          <FlatList
            data={programData}
            renderItem={({item}) => {
              return (
                <TouchableOpacity key={item.P_Id} onPress={()=>{ navigation.navigate('addplo',{item})}}>
                  
                <View style={styles.Card}>
                  

                  <Text style={styles.text1}>{item.Title}</Text>
                  <Text style={styles.text}>{item.Description}</Text>
  

                  <View style={styles.CardButton}>
                    <TouchableOpacity
                      style={styles.EditButton}
                      onPress={()=>movecourse(item)}
                      >
                      <Text style={styles.ButtonText}>Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.DeleteButton1}
                      onPress={()=>moveallocation(item)}
                      >
                      <Text style={styles.ButtonText}>Allocation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.DeleteButton}
                      onPress={()=>moveplo(item)}
                      >
                      <Text style={styles.ButtonText}>PLOS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </TouchableOpacity>
                 
                
              );
             
            }}
          />

          
          </View>
        )}
      
      </View>
      {!isLoading && programData.length < 1 && (
        <View style={styles.NoData}>
          <Text style={styles.NotDataText}>
            You Have No data yet. Please Add Some!!!
          </Text>
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
                <MaterialCommunityIcons name="close-thick" size={25} color="black"/>
              </Pressable>
              <Text style={styles.ModalHeaderText}>ADD program</Text>

              <TextInput
                style={styles.InputFields}
                mode="outlined"
                label="Title"
                value={title}
                onChangeText={newText => {
                  settitle(newText);
                }}
              />

              <TextInput
                style={styles.InputFields1}
                multiline={true}
                mode="outlined"
                label="Description"
                value={description}
                onChangeText={newText => {
                  setdescription(newText);
                }}
              />
              <Pressable
                style={styles.modalButton}
                onPress={() => addProgram()}>
                <Text style={styles.textStyle}>ADD</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.bottomView}>
      <TouchableOpacity
              
              onPress={() => HandleEdit()}>
            <Icon name="ios-add-circle" size={40} color="green" />
            </TouchableOpacity>
        </View>
      
    </View>
  
  );
};

export default program;
const styles = StyleSheet.create({
  AppContainerActive: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  AppContainerDisable: {
    flex: 1,
   // opacity: 0.2,
    backgroundColor: '#f2f2f2',
  },
  Container: {
    margin: 5,
  },

  Card: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ced0d2',
    borderTopWidth:3,
   borderTopColor:'orange',
    borderWidth: 3,
    height: 180,
    width: 350,
    paddingLeft: 5,
   paddingRight: 5,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
  },
  CardButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  EditButton: {
    backgroundColor: '#4E944F',
    height: 30,
    width: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DeleteButton: {
    backgroundColor: '#4E944F',
    height: 30,
    width: 60,
    marginLeft: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DeleteButton1: {
    backgroundColor: '#4E944F',
    height: 30,
    width: 79,
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
    fontWeight: 'bold',
  },
  text1: {
    
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'center'
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
    marginBottom:4,
    marginLeft:'90%',
    
  }
  ,
  modalButton2: {
    borderRadius: 20,
    elevation: 2,
    alignSelf: 'flex-end',
  }
 
});
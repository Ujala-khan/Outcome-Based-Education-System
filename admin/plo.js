import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  AsyncStorage,

  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { TextInput, DataTable } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import preplos from './preplos';
import { Tooltip } from 'react-native-elements';

const plo = ({ navigation, route }) => {
  const[P_Id,setP_Id]=useState('')
 const[Title,setpTitle]=useState('')
 const[Description,setpDescription]=useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [ploData, setPloData] = useState([]);
  const [modaltitle, setmodeltitle] = useState('ADD PLOS');
  const [id, setId] = useState('');
  const [buttonTitle, setButtonTitle] = useState('Add');
  const [isLoading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getStoredprogram = async () => {
    try {
      const storedObject = await AsyncStorage.getItem('program');
      console.log('Stored object:', storedObject);
      if (storedObject !== null) {
        const parsedObject = JSON.parse(storedObject);
        console.log('Parsed object:', parsedObject);
        setP_Id(parsedObject.P_Id);
        setpDescription(parsedObject.Description);
        setpTitle(parsedObject.Title);
        console.log('State variables:', P_Id, Description, Title);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };
  
  const update = () => {
   
    try {
      fetch(`${global.apiURL}/plo/UpdatePLO`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Plo_Id:id,
          Name: title,
          Description: description,
          Program_Id:P_Id,
        
        }),
      })
        .then((response) => response.json())
        .then((res) => Alert.alert('', res))
        .then(() => {
          setModalVisible(!modalVisible);
          setButtonTitle('Add');
          setmodeltitle('ADD PLOS')
          setTitle('');
          setDescription('');
          
          getAll();
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };
  

  const getAll = async () => {
    try {
      const response = await fetch(
        `${global.apiURL}/PLO/GetAllPLOs?id=${P_Id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setPloData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (buttonTitle === 'Add') {
      addplo();
    } else if (buttonTitle === 'Update') {
      setTitle(title)
      setDescription(description)
      update();
    }
  };




  /////////////////////////////----Delete User----////////////////////

  const deleteData =(id)=> {
    fetch(
      `${global.apiURL}/plo/DeletePLO`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Plo_Id:id,
          Name: title,
          Description: description,
          Program_Id:P_Id,
        }),
      },
    )
      .then(response => response.json())
      .then(res => Alert.alert('', res));

    getAll();
  };

  /////////////////////////////----Update User----////////////////////
  const addplo = () => {
  
    try {
      fetch(
        `${global.apiURL}/plo/InsertPLO`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Name: title,
            Description: description,
            Program_Id:P_Id,
          }),
        },
      )
      .then(response => response.json())
      .then(res => Alert.alert('', res));
      setModalVisible(!modalVisible);
      setTitle('');
      setDescription('')
      getAll();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStoredprogram();
    navigation.setOptions({ title: Title+'   '+'PLOs',backgroundColor:'red' ,
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    console.log('P_Id:', P_Id);
    console.log('Description:', Description);
    console.log('Title:', Title);
    getAll();
  }, [P_Id, Description, Title]);
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
    
                  <Text style={{color:'black',marginTop:15,margin:3,
                    fontWeight: 'bold',fontSize:15}}>Name</Text>
                  <Text style={{color:'black',marginLeft:35,marginTop:15,  fontWeight: 'bold',fontSize:15}}>Description</Text>
                 
                  <Text style={{color:'black',marginLeft:110,marginTop:15, fontWeight: 'bold',fontSize:15}}>Action</Text>

</View>
               


     
      <FlatList
            data={ploData}
            renderItem={({item,index}) => {
              return (
      //horizontal
      //inverted
    
      <View key={index} style={styles.Card}>
      <View style={{width:70,marginTop:15,margin:3}}>
      <Text style={styles.text}>{item.Name}</Text>
      </View>
      <View style={{width:100,marginTop:15}}>
      <Tooltip
            popover={<Text>{item.Description}</Text>}
            height={null}
            skipAndroidStatusBar={true}
          >
            <Text numberOfLines={1}  style={styles.text}>{item.Description}</Text>
          </Tooltip>
      </View>
      <View style={{width:70,marginTop:15,marginLeft:95,marginRight:10,  flexDirection: "row", }}>
      <TouchableOpacity
           onPress={() => {
            setButtonTitle('Update');
            setmodeltitle('Update PLOS');
            setId(item.Plo_Id);
            setTitle(item.Name);
            setDescription(item.Description);
           
            setModalVisible(true);
          }}>
            <Icon name="pencil" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft:7}}
              onPress={() => deleteData(item.Plo_Id)}>
             <MaterialCommunityIcons name="delete" size={25} color="black"/>
            </TouchableOpacity>
      </View>
       </View>
        
   
           
      
       
   
        
        
       );
             
            }}
          />
    
      
       
       </View>
                 
                
             

          
          </View>
        )}
      
      </View>
    
      {!isLoading && ploData.length < 1 && (
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
                 <Icon name="remove" size={20} color="black" />
              </Pressable>
              <Text style={styles.ModalHeaderText}>{modaltitle}</Text>

              <TextInput
                style={styles.InputFields}
                mode="outlined"
                label="Title"
                value={title}
                onChangeText={newText => {
                  setTitle(newText);
                }}
              />

              <TextInput
                style={styles.InputFields1}
                multiline={true}
                mode="outlined"
                label="Description"
                value={description}
                onChangeText={newText => {
                  setDescription(newText);
                }}
              />
                <View style={{ flexDirection: 'row' }}>
                {buttonTitle === 'Add' && (
              <Pressable
             
                style={styles.modalButton1}
                onPress={()=>{ navigation.navigate('preplos',{   P_Id: P_Id,})}}>
                <Text style={styles.textStyle1}>select from prevoius program</Text>
              </Pressable>
              )}
              <Pressable
                style={styles.modalButton}
                onPress={() => save()}>
                <Text style={styles.textStyle}>{buttonTitle}</Text>
              </Pressable>
              
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

export default plo;
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
    //fontWeight: 'bold',
  },
  text1: {
    
    color: 'black',
    fontSize: 18,
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
    
  }
 
});

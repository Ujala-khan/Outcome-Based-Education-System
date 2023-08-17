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
import { Tooltip } from 'react-native-elements';

const clo = ({ navigation, route }) => {
  const[C_Id,setC_Id]=useState('')
 const[CName,setCName]=useState('')

  const [modalVisible, setModalVisible] = useState(false);
  const [cloData, setcloData] = useState([]);
  const [modaltitle, setmodeltitle] = useState('ADD CLOs');
  const [id, setId] = useState('');
  const [Allocate, setAllocate] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Add');
  const [isLoading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getStoredcourse = async () => {
    try {
      const cid= await AsyncStorage.getItem('coursID');
      const cname= await AsyncStorage.getItem('courseName');
      const Allocate= await AsyncStorage.getItem('allocation');
     
     
      console.log('Stored object:', cid,cname);
      if (cid !== null || cname!==null  || Allocate!==null) {
       
        console.log('Parsed object cid:', cid);
        console.log('Parsed object name:', cname);
        setC_Id(cid);
        setCName(cname);
        setAllocate(Allocate);
        console.log('State variables:', C_Id, CName);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };
  
  const update = () => {
   
    try {
      fetch(`${global.apiURL}/CLO/UpdateCLO`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Clo_Id:id,
            Name: title,
            Description: description,
            Course_Id:C_Id,
        
        }),
      })
        .then((response) => response.json())
        .then((res) => Alert.alert('', res))
        .then(() => {
          setModalVisible(!modalVisible);
          setButtonTitle('Add');
          setmodeltitle('ADD CLOs')
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
        `${global.apiURL}/CLO/GetAllCLOs?id=${C_Id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setcloData(data);
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
      `${global.apiURL}/CLO/DeleteCLO`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Clo_Id:id,
          Name: title,
          Description: description,
          Course_Id:C_Id,
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
        `${global.apiURL}/CLO/InsertCLO`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Name: title,
            Description: description,
            Course_Id:C_Id,
          }),
        },
      );
      setModalVisible(!modalVisible);
      setTitle('');
      setDescription('')
      getAll();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getStoredcourse();
    navigation.setOptions({ title: CName+'   '+'CLOs',backgroundColor:'red' ,
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    console.log('P_Id:', C_Id);
    console.log('Description:', CName);
    
    getAll();
  }, [C_Id,CName]);
  return (

  
    <View style={
      modalVisible ? styles.AppContainerDisable : styles.AppContainerActive
    }
    
    >
      
       <View style={{marginTop:5}}> 
      <View style={styles.Container}>
        {isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
        
          <View>
       
     
         
                <View>
   
                <View style={styles.Card1}>
    
    <Text style={{color:'black',marginTop:15,
      fontWeight: 'bold',fontSize:15,marginLeft:5}}>CLOs</Text>
    <Text style={{color:'black',marginLeft:35,marginTop:15,  fontWeight: 'bold',fontSize:15}}>  Description</Text>
   
    <Text style={{color:'black',marginLeft:110,marginTop:15, fontWeight: 'bold',fontSize:15}}>Action</Text>

</View>


     
      <FlatList
            data={cloData}
            renderItem={({item}) => {
              return (
      //horizontal
      //inverted

      <View  key={item.Clo_Id} style={styles.Card}>
      <View style={{width:80,marginTop:15,marginLeft:5}}>
      <Text style={styles.text1}>{item.Name}</Text>
      </View>
      <View style={{width:90,marginTop:15}}>
      <Tooltip
            popover={<Text>{item.Description}</Text>}
            height={null}
            skipAndroidStatusBar={true}
          >
            <Text numberOfLines={1} style={styles.text1}>{item.Description}</Text>
          </Tooltip>
      </View>
      <View style={{width:70,marginTop:15,marginLeft:95,marginRight:10,  flexDirection: "row", }}>
      <TouchableOpacity
          onPress={() => {
            setButtonTitle('Update');
            setmodeltitle('Update CLOs')
            setId(item.Clo_Id);
            setTitle(item.Name);
            setDescription(item.Description);
           
            setModalVisible(true);
          }}>
            <Icon name="pencil" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft:7}}
              onPress={() => deleteData(item.Clo_Id)}>
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
      </View>
      {!isLoading && cloData.length < 1 && (
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
  {Allocate==='true' ? (
    <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }}>
      <Icon name="plus-circle" size={40} color="green" />
    </TouchableOpacity>
  ) : null}
</View>
      
    </View>
  
  );
};

export default clo;
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  text1: {
    
    color: 'black',
    fontSize: 14,
   
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

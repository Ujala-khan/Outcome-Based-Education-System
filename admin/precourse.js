import { DEFAULT_EXTENSIONS } from '@babel/core';
import React, {useState, useEffect } from 'react';
import {   FlatList,View, StyleSheet, Text ,TouchableOpacity,Alert,ScrollView,ActivityIndicator} from 'react-native';

import { Button, DataTable } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { Tooltip } from 'react-native-elements';



  
export default function precourse({navigation,route}) {
  const [sessionlist, setSessionlist] = useState([]);
    const [session, setSession] = useState(null);
   
  const { P_Id ,sessionName } = route.params;
  const [programNames, setProgramNames] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [programid,setProgramId] =useState(0)
  const [courseData, setcourseData] = useState([]);
  
  const [checkedItems, setCheckedItems] = useState({});
 

  const addallcourse = (selectedItems) => {
    const updatedItems = selectedItems.map(item => {
      return {
        ...item,
       
        Program_Id: P_Id,
        sessionName:sessionName
        // remove the old key if necessary
       // Programid: undefined
      };
    });
  console.log('hhhhh',selectedItems);
  console.log('abfate',updatedItems)
    try {
      fetch(`${global.apiURL}/Course/setListOfCourses`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItems)
      })
    
      .then(response => response.json())
      .then(res => Alert.alert('', res));
        
        getallcourse(programid,session);
    
    } catch (error) {
      console.error(error);
    }
  };

  
  const getallcourse = async (id,sessionN) => {
    try {
      console.log('programid and session',id,sessionN)
      const response = await fetch(
        `${global.apiURL}/Course/GetCoursesProgram?Program_Id=${id}&session=${sessionN}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setcourseData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } 
    finally {
      setLoading(false);
    }
  };

  const GetAllPrograms = async () => {
    try {
      const response = await fetch(
        `${global.apiURL}/Program/GetAllPrograms`,
      );
      const json = await response.json();
      setProgramNames(json);
    
    } catch (error) {
      console.error(error);
    } 
  };
  const getAllsession = async () => {
    try {
      const response = await fetch(`${global.apiURL}/Session/GetAllSession`);
      const json = await response.json();
      setSessionlist(json);
      console.log('session data', json);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleTypeChange = (value) => {
    console.log('id', value);
    setProgramId(value);
    getallcourse(value, session); // Use the updated value from the function parameter
  };
  
  const handlesessionChange = (value) => {
    console.log('session', value);
    setSession(value);
    getallcourse(programid, value); // Use the updated value from the function parameter
  };
  
  useEffect(() => {
    navigation.setOptions({ title:'Previous Program Course',
    headerStyle: {
      backgroundColor: 'green'
     
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },});
   GetAllPrograms();
   getAllsession();
   
  }, []);
  useEffect(() => {
    // ...
    getallcourse(programid, session); // Add this line to fetch initial data
  }, []);
 
  return (
    <View style={
     styles.AppContainerActive
    }
    
    >
      <View>
     
      <Picker
  style={{ backgroundColor: 'gray', marginHorizontal: 30,marginVertical:10 }}
  selectedValue={programid}
  onValueChange={(itemValue) => handleTypeChange(itemValue)}
>
        <Picker.Item label="--Select Program--" value="Program" enabled={false} />
        {programNames?.map((obj, index) => (
          <Picker.Item key={index} label={obj.Title} value={obj.P_Id} />
        ))}
      </Picker>
    
<Picker
  style={{ backgroundColor: 'gray', marginHorizontal: 30 }}
  selectedValue={session}
  onValueChange={(itemValue) => handlesessionChange(itemValue)}
>
<Picker.Item label="--Select session--" value="Program" enabled={false} />
  {sessionlist?.map((obj, index) => (
    <Picker.Item key={index} label={obj.sessionName} value={obj.sessionName} />
  ))}
</Picker>
    </View>

   
      <View style={styles.Container}>
        {isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
        
          <View>
       
     
         
                <View>
                <View style={styles.Card1}>
                  <Text style={{color:'black',marginTop:15,marginLeft:3,
                    fontWeight: 'bold',fontSize:15}}>Name</Text>
                   <Text style={{color:'black',marginLeft:'44%',marginTop:15,  fontWeight: 'bold',fontSize:15}}>Credit_Hour</Text>
                  <Text style={{color:'black',marginLeft:10,marginTop:15, fontWeight: 'bold',fontSize:15}}>Action</Text>


                </View>
      
     
           <FlatList
           keyExtractor={(item, index) => index.toString()}
      data={courseData}
      //horizontal
      //inverted
      renderItem={({ item ,index}) => (
 
      
        <View key={index} style={styles.Card}>
          <View style={{width:200,marginTop:15,marginLeft:3,}}>
        
          <Tooltip
              popover={<Text>{item.Name}</Text>}
              withPointer={false}
            >
        <Text numberOfLines={1} style={styles.text}>
          {item.Name}
        </Text>
        </Tooltip>
           </View>
           
          <View style={{width:50,margin:15}}>
          <Text style={styles.text}>{item.Credit_Hour}</Text></View>
          
       
            <View  style={{marginTop:10}}>
         
            <CheckBox 
  tintColors={{ true: 'green', false: 'green' }}
  disabled={false}
  value={checkedItems[item.C_Id]}
  onValueChange={(newValue) => {
    setCheckedItems({
      ...checkedItems,
      [item.C_Id]: newValue
    });
  }}
/>
           
          
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
        </View>
      )}

<View style={{alignItems:'center'}}>
       <TouchableOpacity
   style={styles.modalButton1}
   onPress={() => {
     const selectedItems = courseData.filter(item => checkedItems[item.C_Id]);
addallcourse(selectedItems);
     
   }}
>
   <Text style={styles.textStyle}>save</Text>
</TouchableOpacity>
    </View>
              
     
      
    </View>
  
  
       
 
  
 
  );
}

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
 
  modalButton: {
    borderRadius: 20,
    padding: 10,
    marginLeft:10,
    elevation: 2,
    backgroundColor: '#49c658',
    width: 150,
    alignSelf: 'flex-end',
  },
 
  modalButton1: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:30,
    backgroundColor: '#49c658',
    width: 200,
    //alignSelf: 'flex-end',
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

 
    row: {
    flexDirection: 'row',
    padding: 10,
  },
     
    
      
      
     
     
       
  
});
import { DEFAULT_EXTENSIONS } from '@babel/core';
import React, {useState, useEffect } from 'react';
import {   FlatList,View, StyleSheet, Text ,TouchableOpacity,Alert,Modal,TextInput} from 'react-native';

import { DataTable } from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';

import { Tooltip } from 'react-native-elements';


import { ScrollView } from 'react-native-gesture-handler';


  
export default function preplos({navigation,route}) {
  const { P_Id  } = route.params;
 
  const [programNames, setProgramNames] = useState([]);
 
  const [programid,setProgramId] =useState(0)
  const [ploData, setPloData] = useState([]);
 
  const [checkedItems, setCheckedItems] = useState({});


  
  const setListOfPLOs = async (selectedItems) => {
    const updatedItems = selectedItems.map(item => {
      return {
        ...item,
       
        Program_Id: P_Id,
        // remove the old key if necessary
       // Programid: undefined
      };
    });
    console.log('jjjjj',checkedItems)
    console.log('kabx',updatedItems)
    try {
      fetch(`${global.apiURL}/PLO/setListOfPLOs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItems)
      })
    
      .then(response => response.json())
      .then(res => Alert.alert('', res));
        getallplo(programid);
    
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const getallplo = async (id) => {
    try {
      const response = await fetch(
        `${global.apiURL}/PLO/GetAllPLOs?id=${id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setPloData(data);
    } catch (error) {
      console.error(error);
    } 
  };

  const GetAllPrograms = async () => {
    try {
      const response = await fetch(
        `${global.apiURL}/Program/GetAllPrograms `,
      );
      const json = await response.json();
      setProgramNames(json);
    
    } catch (error) {
      console.error(error);
    } 
  };
  useEffect(() => {
    navigation.setOptions({ title:'Previous Program PLOs',
    headerStyle: {
      backgroundColor: 'green'
     
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },});
   GetAllPrograms()
  }, []);
  
  return (
   
    <View style={styles.container}>
      
  
     
      <Picker
  style={{ color: 'black', backgroundColor: '#dcdcdc', width: 250, height: 0.5,marginLeft:'12%' }}
  selectedValue={programid}
  onValueChange={(value) => {
    setProgramId(value);
    getallplo(value);
  }}
>
  <Picker.Item label="--Select Program--" value="Program" />
  {programNames.map((data) => {
    return (
      <Picker.Item label={data.Title} value={data.P_Id} key={data.P_Id} />
    );
  })}
</Picker>

   

      


            
    <View style={{paddingTop:20}}>
      <DataTable>
      <DataTable.Header>
        <DataTable.Title>PLOs</DataTable.Title>
        <DataTable.Title >Description</DataTable.Title>
        <DataTable.Title numeric>ADD</DataTable.Title>
      </DataTable.Header>

     
      <FlatList
            data={ploData}
            renderItem={({item,index}) => {
              return (
      //horizontal
      //inverted
    
        <DataTable.Row key={index}>
        <DataTable.Cell>{item.Name}</DataTable.Cell>
        <DataTable.Cell >{item.Description}</DataTable.Cell>
        <DataTable.Cell numeric>
        <View style={styles.checkboxContainer}>
        <CheckBox 
  tintColors={{ true: 'green', false: 'green' }}
  disabled={false}
  value={checkedItems[item.Plo_Id]}
  onValueChange={(newValue) => {
    setCheckedItems({
      ...checkedItems,
      [item.Plo_Id]: newValue
    });
  }}
/>
       
       </View>
           
        </DataTable.Cell>
      </DataTable.Row>
       
    
        
        
      )}}
    
      />
       </DataTable>
       
       </View>
      
       <View style={{paddingTop:40,alignItems:'center'}}>
      

    </View>
    <TouchableOpacity
   style={styles.button1}
   onPress={() => {
    const selectedItems = ploData.filter(item => checkedItems[item.Plo_Id]);
      setListOfPLOs(selectedItems)
   }}
>
   <Text style={styles.buttonText}>save</Text>
</TouchableOpacity>
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    //alignItems: 'center',
    //justifyContent: 'center',
    },
    
      text: {
        
        color: 'black',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize:17,
        paddingEnd:10
        },
        
    
    body: {
      
      flexDirection: "row", 
      justifyContent:"space-evenly",
      paddingTop:15,
      borderRadius:10,
      borderColor:'#d3d3d3', 
      borderWidth:1,
      height:'10%'
      },
  
  button:
      {
        width:'35%',
        height:'70%',
        backgroundColor:'green',
        color:'#fff',
        borderRadius:10,
        paddingLeft:10,
        textAlign:'center'
      },
      button1:
      {
       
        backgroundColor: '#5D9C59',
    height: 40,
    width: 290,
    marginLeft: 20,
    marginTop:8,
    marginBottom:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
      },
      
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
   // backgroundColor:'red',

  },
      
      buttonText: {
        //paddingTop:6,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
      },
     
     
       
  
});
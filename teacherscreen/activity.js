import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity, TextInput,Alert ,AsyncStorage,ScrollView,Modal} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer';

//import { ScrollView } from 'react-native-gesture-handler';

export default function activity({ navigation }) {
    const[ccode,setccode]=useState('')
    const [CLOsAgainstType, setCLOsAgainstType] = useState([])
    const [CLOsRemainingWeightage, setCLOsRemainingWeightage] = useState([])
    const [totalMarks, setTotalMarks] = useState();
    const[C_Id,setC_Id]=useState('')
    const[CName,setCName]=useState('')
    const[Semester,setSemester]=useState('')
    const[Section,setSection]=useState('')
    const[Username,setUsername]=useState('')
  const [closTypeNW, setClosTypeNW] = useState([]);
  const [closWeightage, setClosWeightage] = useState();
  const [closName, setClosName] = useState();

  const [modalVisible, setModalVisible] = useState(false);
   
   // const closTypeNW = [{ Plo_Id: 1, Name: "CLO1" }, { Plo_Id: 2, Name: "CLO2" },{ Plo_Id: 3, Name: "CLO3" },]; // sample data
    const [activity, setActivity] = useState([
        {
          Type: "Quiz",
        },
        {
          Type: "Assignment",
        },
        {
          Type: "presentation",
        },
        {
          Type: "Mid Exam",
        },
        {
          Type: "Final Exam",
        },
      ]);
      const [typeName, setTypeName] = useState("activity");
      


 
  const getStoredcourse = async () => {
    try {
      const cid= await AsyncStorage.getItem('coursID');
      const cname= await AsyncStorage.getItem('courseName');
      const user= await AsyncStorage.getItem('user');
      const semester= await AsyncStorage.getItem('semester');
      const section= await AsyncStorage.getItem('section');
     
     
     
      console.log('Stored object:', cid,cname);
      if (cid !== null || cname!==null  || user!==null|| semester!==null  || section!==null) {
       
        console.log('Parsed object cid:', cid);
        console.log('Parsed object name:', cname);
        setC_Id(cid);
        setCName(cname);
        setUsername(user);
        setSection(section);
        setSemester(semester)
      
        console.log('State variables:', C_Id, CName);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };
  /// add activity
  const addActivityAction = async (List) => {
    try {
      console.log('activity is ', List);
  
      const saveActivityResponse = await fetch(`${global.apiURL}/Activity/saveActivity`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(List),
      });
  
      if (saveActivityResponse.ok) {
        console.log('Activity saved successfully1');
  
        const saveQuestionActivityResponse = await fetch(`${global.apiURL}/Activity/SaveQuestionActivity`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(List),
        });
  
        if (saveQuestionActivityResponse.ok) {
          const responseData = await saveQuestionActivityResponse.json();
          console.log('Activity saved successfully:2', responseData);
          // Access the returned data, such as Activity_Id and Course_Id
          const { Activity_Id, Course_Id } = responseData;
  
          // Handle the returned data as needed
          const createResultSheetResponse = await fetch(`${global.apiURL}/Activity/CreateResultSheetForStudent?activityId=${Activity_Id}&courseId=${Course_Id}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
  
          if (createResultSheetResponse.ok) {
            const responseData = await createResultSheetResponse.json();
            console.log('Result sheet created successfully:', responseData);
            // Handle the success response as needed
          } else {
            console.log('Failed to create result sheet');
          }
        } else {
          console.log('Failed to save activity');
        }
  
        Alert.alert('', 'Activity saved successfully');
      } else {
        console.log('Failed to save activity');
        Alert.alert('', 'Failed to save activity');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('', 'An error occurred while saving the activity');
    }
  };
  




  //get clos
  const getclosagainstactivity = async (type) => {
    try {
      console.log('data hn ye',type)
      const response = await fetch(
        `${global.apiURL}/Activity/getActivityMappedCLOs?type=${type}&courseID=${C_Id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setCLOsAgainstType(data);
      console.log('clos1 ha',data)
   
    } catch (error) {
      console.error(error);
    } 
  };
  console.log('clos h',closTypeNW);
 // Make the API request
const getRemainingWeightageAction = async (obj) => {
  try {
    const response = await fetch(`${global.apiURL}/Activity/getRemainingweightage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    if (response.ok) {
      const result = await response.json();
      setCLOsRemainingWeightage(result);
      // Process the result here
      console.log(result);
    } else {
      console.error('Request failed:', response.status);
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

 
  const handleTypeChange = (value) => {
    let obj = {
      Type: value,
      Course_ID: C_Id,
      Teacher_ID: Username,
    };
    setTypeName(value);
    getclosagainstactivity(value);
    getRemainingWeightageAction(obj);
    // dispatch(getCLOsAgainstTypeAction(e.target.value));
   // dispatch(getRemainingWeightageAction(obj));
   
  };
  useEffect(() => {
    getStoredcourse();
    navigation.setOptions({ title: 'Create'+' '+'Activity',backgroundColor:'red' ,
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    console.log('P_Id:', C_Id);
    console.log('Description:', CName);
    
   
  }, [C_Id,CName]);



  


   const [inputList, setInputList] = useState([]);
  useEffect(() => {
    if (CLOsAgainstType.length > 0 && inputList.length===0) {
      setInputList([
        ...inputList,
        {
          Q_No: inputList[inputList.length - 1]?.Q_No + 1 || 1,
          Question1: "",
          Type: typeName,
          Teacher_ID: Username,
          Course_ID: C_Id,
          Semester:Semester,
          Section: Section,
          Mapping: "",
          selectedChips: [],
          options: CLOsAgainstType,
          Total_Marks: "",
        },
      ]);
    }
  }, [CLOsAgainstType]);

  useEffect(() => {
    let temp = [];
    if (CLOsRemainingWeightage.length > 0) {
      CLOsRemainingWeightage.forEach((obj) => {
        temp.push({ Name: obj.Key, Weightage: 100 - obj.Value });
      });
      CLOsAgainstType.forEach((obj) => {
        const existingCLO = CLOsRemainingWeightage.find(
          (item) => item.Key === obj.Name
        );
        if (!existingCLO) {
          temp.push({ Name: obj.Name, Weightage: 100 });
        }
      });
    } else {
      CLOsAgainstType.forEach((obj) => {
        temp.push({ Name: obj.Name, Weightage: 100 });
      });
    }
    setClosTypeNW(temp);
  }, [CLOsAgainstType, CLOsRemainingWeightage]);

  // useEffect(()=>{

  // },[closWeightage])
  console.log("inputList==", inputList);
  const handleInputChange = (name, value, index) => {
  const list = [...inputList];
   if (name == "Total_Marks") {
      list[index][name] = Number(value);
    } else {
      list[index][name] = value;
    }
    setInputList(list);

};


 
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    const existingMapping = list[index].Mapping;
    console.log("existingMapping", existingMapping);
    if (existingMapping) {
      const NameWeightageClos = existingMapping
        .split(",")
        .map((pair) => {
          const [key, value] = pair.split(":");
          if (key) {
            return { key, value };
          }
        })
        .filter(Boolean);
      if (NameWeightageClos.length > 0) {
        const updatedData = closTypeNW?.map((data) => {
          const match = NameWeightageClos.find(
            (pair) => pair.key === data.Name
          );
          if (match) {
            return {
              ...data,
              Weightage: Number(data.Weightage) + Number(match.value),
            };
          } else {
            return data;
          }
        });
        console.log(updatedData);
        setClosTypeNW(updatedData);
      }

      list.splice(index, 1);
      setInputList(list);
    } else {
      list.splice(index, 1);
      setInputList(list);
    }
  };
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        Q_No: inputList[inputList.length - 1]?.Q_No + 1 || 1,
        Question1: "",
        Type: typeName,
        Teacher_ID: Username,
        Course_ID: C_Id,
        Semester: Number(Semester),
        Section: Section,
        Mapping: "",
        selectedChips: [],
        options: CLOsAgainstType,
        Total_Marks: "",
      },
    ]);
  };
  useEffect(() => {
    setInputList([]);
    if (typeName != "activity") {
      getclosagainstactivity(typeName);
     
    }
  }, [typeName]);

  const handleWeightage = (obj, index) => {
    setClosName({
      name: obj.Name,
      index: index,
    });
   setModalVisible(!modalVisible);
  };
  const removeWeightage = (name, index) => {
    console.log("name", name);
    const list = [...inputList];
    const existingMapping = list[index].Mapping;

    const arr = existingMapping.split(",");
    const found = arr.find((s) => s.startsWith(name));
    const result = found ? found.split(":")[1] : 0;
    const closWeightageNew = closTypeNW.find((c) => c.Name === name);
    if (closWeightageNew) {
      let newWeightage = Number(closWeightageNew.Weightage) + Number(result);
      setClosTypeNW((prevData) =>
        prevData.map((obj) => {
          if (obj.Name === name) {
            return { ...obj, Weightage: newWeightage };
          }
          return obj;
        })
      );
    }

    // // Remove the target CLO and its weightage from the mapping string
    // const updatedMappingString = existingMapping.replace(
    //   new RegExp(`${name}:[^,]*,?`),
    //   ""
    // );
    // list[index].Mapping = updatedMappingString;

    const mappingArray = existingMapping.split(",");
    const filteredArray = mappingArray.filter(
      (substring) => !substring.startsWith(`${name}:`)
    );

    const updatedMappingString = filteredArray.join(",");

    list[index].Mapping = updatedMappingString;
    const selectedChips = list[index].selectedChips;
    const chipIndex = selectedChips.indexOf(name);
    if (chipIndex !== -1) {
      selectedChips.splice(chipIndex, 1);
      setInputList(list);
    }
    // selectedChips.splice(name, 1);
    // setInputList(list);
  };
  const addWeightage = () => {
    const closWeightageNew = closTypeNW.find((c) => c.Name === closName.name);

    if (closWeightageNew) {
      let newWeightage = closWeightageNew.Weightage - closWeightage;
      if (newWeightage >= 0) {
        setClosTypeNW((prevData) =>
          prevData.map((obj) => {
            if (obj.Name === closName.name) {
              return { ...obj, Weightage: newWeightage };
            }
            return obj;
          })
        );
        const list = [...inputList];
        const selectedChips = list[closName.index].selectedChips || [];
        selectedChips.push(closName.name);
        list[closName.index].selectedChips = selectedChips;
        const existingMapping = list[closName.index].Mapping;
        let newMapping;
        if (existingMapping == "") {
          newMapping = `${closName.name}:${closWeightage}`;
        } else {
          newMapping = `,${closName.name}:${closWeightage}`;
        }

        list[closName.index].Mapping = existingMapping
          ? existingMapping + newMapping
          : newMapping;
        setInputList(list);
      
        setClosWeightage();
        setModalVisible(!modalVisible);
      } else {
        alert("You did not enter a weightage.");
      }
    }
  };
  //   const mappingString = "CLO1:34,CLO45:345,"; // Replace with the actual mapping string
  // const targetCLO = "CLO1"; // Replace with the target CLO to remove

  // // Remove the target CLO and its weightage from the mapping string
  // const updatedMappingString = mappingString.replace(new RegExp(`${targetCLO}:[^,]*,?`), "");

  // console.log(updatedMappingString); // Output: "CLO45:345,"
  // new
  // const mappingString = "CLO1:34,CLO45:345,"; // Replace with the actual mapping string
  // const targetCLO = "CLO1"; // Replace with the target CLO to remove

  // // Split the mapping string into an array of substrings
  // const mappingArray = mappingString.split(',');

  // // Filter out the target CLO substring from the array
  // const filteredArray = mappingArray.filter((substring) => !substring.startsWith(targetCLO));

  // // Join the remaining substrings back into a string using the comma separator
  // const updatedMappingString = filteredArray.join(',');

  // console.log(updatedMappingString); // Output: "CLO45:345,"
  const saveActivity = () => {
  
    const newInputList = inputList.map(
      ({ options, selectedChips, ...rest }) => rest
    );
    console.log("modifiedArray", newInputList);

 
      addActivityAction(newInputList, () => {
        setTypeName("activity");
        setClosTypeNW([]);
        setInputList([]);
      })
    
  };
    return (
        <View style={styles.container}>
          <ScrollView>
           <View style={{ marginVertical: 10 }}>
  <View style={{ backgroundColor: '#708090', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
    <Text style={{ fontSize: 22, fontWeight: '600', color: '#fff', textTransform: 'uppercase' }}>{CName}</Text>
  </View>
</View>

 
    <View>
      <Text style={{ fontSize: 18, fontWeight: '400',color:'black',textAlign:'center' }}>Select Activity</Text>
      <Picker style={{backgroundColor:'#a9a9a9', marginHorizontal: 30, marginVertical: 10 }}
        selectedValue={typeName}
        onValueChange={(itemValue) => handleTypeChange(itemValue)}
      >
        <Picker.Item label="--Select Activity--" value="activity" enabled={false} />
        {activity?.map((obj, index) => (
          <Picker.Item key={index} label={obj.Type} value={obj.Type} />
        ))}
      </Picker>
    </View>


<View style={{ marginHorizontal: 15, marginVertical: 10 }}>
<ScrollView horizontal={true}>
  <View style={{ marginVertical: 8 }}>

    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {closTypeNW?.map((obj) => (
            
        <View
          key={obj.Name}
          style={{
           // backgroundColor: obj?.Name === name ? '#007bff' : '#dcdcdc',
          //borderColor: obj?.Name === name ? '#007bff' : '#dcdcdc',
           borderColor:'#dcdcdc',
           backgroundColor:'#dcdcdc',
            borderWidth: 1,
            borderRadius: 25,
            paddingHorizontal: 6,
            paddingVertical: 10,
            marginHorizontal: 5,
          }}
        
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              //color: obj?.Name === name ? '#fff' : '#000',
              color:'black'
            }}
          >
            {obj?.Name} {obj.Weightage}%
          </Text>
        </View>
    
      ))}
    </View>

  </View>
  </ScrollView>
</View>

<View style={{ paddingHorizontal: 3, marginHorizontal: 5 }}>
  {inputList?.map((x, i) => {
    return (
      <React.Fragment key={i}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ fontSize: 22, fontWeight: '600',color:'black' }}>Q {x.Q_No}</Text>
          </View>
          <View style={{ flex: 6 }}>
            <View style={{ flexDirection: 'row' }}>
              {x?.options?.map((obj, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    cursor: 'pointer',
                    borderWidth: 1,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    marginHorizontal: 2,
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                    fontWeight: '600',
                    fontSize: 16,
                    backgroundColor: x.selectedChips.includes(obj.Name) ? '#007bff' : '#dcdcdc',
                    color: x.selectedChips.includes(obj.Name) ? '#fff' : '#000',
                  }}
                  onPress={() => {
                    x.selectedChips.includes(obj.Name) ? removeWeightage(obj.Name, i) : handleWeightage(obj, i);
                  }}
                >
                  <Text style={{color:'black'}}>{obj?.Name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 3 }}>
              <TextInput
              placeholder='Question'
              placeholderTextColor={'black'}
              name="Question1"
              value={x.Question1}
             
                style={{
                  borderWidth: 1,
                  color:'black',
                  borderColor: 'gray',
                  borderRadius: 5,
                  padding: 10,
                  width:'130%',
                  marginBottom: 10,
                }}
                onChangeText={(text) => handleInputChange('Question1', text, i)}
                required
              />
            </View>
            <View style={{ flex: 2, marginLeft: 10 }}>
              <TextInput
                placeholder='Marks'
                placeholderTextColor={'black'}
                name="Total_Marks"
                value={x.Total_Marks}
                style={{
                  width:'75%',
                  marginLeft:40,
                  borderWidth: 1,
                  borderColor: 'gray',
                  color:'black',
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 10,
                }}
                onChangeText={(text) => handleInputChange('Total_Marks', text , i)}
                required
              />
            </View>
            <View style={{ flex: 1 }}>
              {inputList.length !== 1 && (
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => handleRemoveClick(i)}>
                  <Text>
                  <Icon name="minus-circle" size={20} color={'red'} />
                    
                  </Text>
                </TouchableOpacity>
              )}

              {inputList.length - 1 === i && (
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={handleAddClick}>
                  <Text>
                  <Icon name="plus-circle" size={20} color={'red'}  />
                   
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </React.Fragment>
    );
  })}
</View>

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
              <Text style={styles.ModalHeaderText}>Add Weightage</Text>

              <TextInput
                  style={{ borderColor: '#ddd', borderWidth: 1, padding: 10, marginBottom: 20 ,color:'black'
                }}
                  placeholder="Enter weightage"
                  value={closWeightage}
                  onChangeText={setClosWeightage}
                  keyboardType="numeric"
              />

    
                <View style={{ flexDirection: 'row' }}>
             
              <Pressable
                style={styles.modalButton}
                onPress={addWeightage}>
                <Text style={{textAlign:'center',fontWeight:'bold',fontSize:15}}>Add</Text>
              </Pressable>
              <Pressable
             
             style={styles.modalButton}
             onPress={()=>{ setModalVisible(!modalVisible);}}>
             <Text style={{textAlign:'center',fontWeight:'bold',fontSize:15}}>Cancel</Text>
           </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
<TouchableOpacity style={styles.Button}  onPress={saveActivity}>
  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:15}}>Create Activity</Text>
</TouchableOpacity>
              
</ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        margin: 10,
        color: 'black',
        textAlign: 'center'
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
    Button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      backgroundColor: '#49c658',
      width: 160,
      marginTop:20,
      alignSelf: 'center',
    },
});

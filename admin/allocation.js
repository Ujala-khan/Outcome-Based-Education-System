import {View, Text, Button,PermissionsAndroid ,AsyncStorage,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import React ,{useState,useEffect}from 'react';
import DocumentPicker from 'react-native-document-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import { Tooltip } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function allocation({navigation,route}) {

 
  const[P_Id,setP_Id]=useState('')
  const[Title,setTitle]=useState('')
  const[Description,setDescription]=useState('')
  const [courses, setCourses] = useState([]);
  const[session,setsession]=useState(null)

  ///get program data
  const getStoredprogram = async () => {
    try {
      const storedObject = await AsyncStorage.getItem('program');
      const sessionName = await AsyncStorage.getItem('Session');
      console.log('Stored object:', storedObject);
      if (storedObject !== null || sessionName !==null) {
        const parsedObject = JSON.parse(storedObject);
        console.log('Parsed object:', parsedObject);
        setP_Id(parsedObject.P_Id);
        setsession(sessionName);
        setDescription(parsedObject.Description);
        setTitle(parsedObject.Title);
        console.log('State variables:', P_Id, Description, Title);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };
  ///save allocate teacher
  const saveallocation = async () => {

console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',courses)
fetch(`${global.apiURL}/AllocationCourse/allocationTeacher`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(courses)
})
  .then((response) => response.json())
  .then((responseData) => {

    // Handle the API response here
    console.log(responseData);
    Alert.alert('', responseData)
  })
  .catch((error) => {
    console.error(error);
  });

  }
  const getAll = async () => {
    try {
      const response = await fetch(
        `${global.apiURL}/AllocationCourse/getAllocation?programId=${P_Id}&session=${session}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      setCourses(data);
      console.log('jjjjjjjjjj',data)
      
    } catch (error) {
      console.error(error);
    } finally {
    
    }
  };
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
      getAll();
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getStoredprogram();
    navigation.setOptions({ title: Title+'   '+'Allocation' ,
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set th
    console.log('P_Id:', P_Id);
    console.log('Description:', Description);
    console.log('Title:', Title);
    getAll();
  }, [P_Id, Description, Title,session]);
  const colors = ["#577D86", "#F7E1AE", "#DAF7A6", "#add8e6"];

  // Create a map of course names to row color  
  const colorsByCourse = {};
  let colorIndex = 0;
  if (courses && courses.length > 0) {
  courses.forEach(course => {
    if (!colorsByCourse[course.Name]) {
      colorsByCourse[course.Name] = colors[colorIndex % colors.length];
      colorIndex++;
    }
  });}
  else{
    return (
      
      
        <View style={styles.NoData}>
        
        <View style={{marginHorizontal: 40,marginTop:20}}>
      <TouchableOpacity  style={styles.DeleteButton} onPress={sendExcelFileToApi}>
      <View style={{flexDirection: 'row',}}>
      <MaterialCommunityIcons name="file-upload" size={20} color="white"/>
              <Text> Select Document</Text></View>
            </TouchableOpacity>
       
      </View>
      
          
          <Text style={styles.NotDataText}>
            You Have No data yet. Please Add Some!!!
          </Text>
        </View>
    
    );
  }

  courses.sort((a, b) => a.Name.localeCompare(b.Name));
  function handleRowClick(index) {
    setSelectedRowIndex(index);
  }
  const handleRadioChange = (courseName, section) => {
    const newState = courses.map((c) => {
      if (c.Name === courseName) {
        return {
          ...c,
          Allocate: c.Section === section ? "true" : "false",
        };
      } else {
        return c;
      }
    });
    setCourses(newState);
  };

  return (
    <ScrollView>
    <View>

     
      <View style={{marginHorizontal: 40,marginTop:5}}>
      <TouchableOpacity  style={styles.DeleteButton} onPress={sendExcelFileToApi}>
              <Text style={{fontWeight:  'bold',fontSize:15,color:'white'} }>Select Document</Text>
            </TouchableOpacity>
       
      </View>
      <View  style={{marginTop:5}}>
    
                <View style={styles.Card1}>
                  <Text style={{color:'black',marginTop:15,marginLeft:5,
                    fontWeight: 'bold',fontSize:15}}>Course</Text>
                  <Text style={{color:'black',marginLeft:50,marginTop:15,  fontWeight: 'bold',fontSize:15}}>Class</Text>
                  <Text style={{color:'black' ,marginLeft:35,marginTop:15,  fontWeight: 'bold',fontSize:15}}>Teacher</Text>
                  <Text style={{color:'black',marginLeft:63,marginTop:15, fontWeight: 'bold',fontSize:15}}>Allocate</Text>


                </View>
      
      {courses.map((course, index) => (
        <View
        key={index}
        //onPress={() => handleRowClick(index)}
        style={{
          backgroundColor: colorsByCourse[course.Name],
          height:50,
         // padding: 10,
        //  marginVertical: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        
        }}
      >
        <View style={{width:70,marginLeft:3,}}>
       
       
       
        <Tooltip
              popover={<Text>{course.Name}</Text>}
              withPointer={false}
              height={null}
              skipAndroidStatusBar={true}
            >
        <Text numberOfLines={1} style={{marginTop:15,color:'black',marginLeft:3}}>{course.Name}</Text>
        </Tooltip>
        </View> 
        <View style={{width:30}}>
          <Text style={{marginTop:15,color:'black'}}>{course.Semester + " " + course.Section}</Text>
          </View>
          <View style={{width:80,}}>
          <Text style={{marginTop:15,color:'black'}}>{course.Teacher_Name}</Text>
          </View>
          <View >
         
          <RadioButton.Group
          key={courses.Name}
          // value={course.Allocate}
          // onValueChange={()=>{
          //   setCourses(prevCourses => {
          //         const updatedCourses = [...prevCourses];
          //         updatedCourses[index].Allocate = !value;
          //         return updatedCourses;
          //       });
          // }}
         
  onValueChange={value => {
    console.log(">>>",typeof course.Allocate)
    console.log("value",!value)

   
    handleRadioChange(course.Name, value)
  }}
  value={course.Allocate === "true" ? course.Section : null}
>
<RadioButton.Item
    
      value={course.Section}
     
    />
</RadioButton.Group>

          </View>
        </View>
      ))}
  </View>
  <TouchableOpacity  style={styles.DeleteButton} onPress={() => saveallocation()}>
              <Text style={{fontWeight:  'bold',fontSize:18,color:'white'} }>save</Text>
            </TouchableOpacity>
 
    </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  
   
   
  DeleteButton: {
    backgroundColor: 'green',
    height: 40,
    marginLeft:20,
    width: '90%',
   marginTop:10,
   marginBottom:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  
  NoData: {
    flex: 1,
    marginTop:30,
   
    //alignItems: 'center',
    //justifyContent: 'center',
    top: -50,
  },
  NotDataText: {
    color: 'white',
    marginTop:'60%',
    backgroundColor: '#eea52d',
    padding: 20,
    fontSize: 16,
    borderRadius: 15,
  },
  Card1: {
    borderColor: 'black',
    
    borderWidth: 1,
    backgroundColor: '#2e8b57',
    height: 50,
  
    flexDirection: 'row',
  
  },
    
  

});
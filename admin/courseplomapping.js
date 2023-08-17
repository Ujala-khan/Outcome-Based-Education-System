import React, { useState,useEffect } from 'react';
import { StyleSheet, View ,ScrollView,TextInput ,Alert,AsyncStorage,Text,TouchableOpacity} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';


const courseplomapping = ({navigation}) => {
    const [weights, setWeights] = useState([]);
    const[session,setsession]=useState(null)
  const[P_Id,setP_Id]=useState('')
  const[Title,setTitle]=useState('')
  const[Description,setDescription]=useState('')
  const [value, setValue] = useState("");
  const[PLOs,setplos]=useState([])
  const[Courses,setcourses]=useState([])
  const [newWeight, setNewWeights] = useState([]);

  const addmapping = async (list) => {
  
 
    
    try {
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',list)
fetch(`${global.apiURL}/CourseMapingPLOs/Mapping`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(list)
})
.then(response => response.json())
.then(res => Alert.alert('', res))
  .catch((error) => {
    console.error(error);
  });

    } catch (error) {
      console.error(error);
    } 
 
  };
  const getStoredprogram = async () => {
    try {
      const storedObject = await AsyncStorage.getItem('program');
      const sessionName = await AsyncStorage.getItem('Session');
      console.log('Stored object:', storedObject);
      if (storedObject !== null|| sessionName!==null) {
        const parsedObject = JSON.parse(storedObject);
        console.log('Parsed object:', parsedObject);
        setP_Id(parsedObject.P_Id);
        setDescription(parsedObject.Description);
        setsession(sessionName)
      
        setTitle(parsedObject.Title);
        console.log('State variables:', P_Id, Description, Title);
        getAllcourses(parsedObject.P_Id,sessionName);
        GetAllPLOs(parsedObject.P_Id);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };
  const GetAllPLOs = async (id) => {
    try {
      const response = await fetch(
        `${global.apiURL}/PLO/GetAllPLOs?id=${id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setplos(data);
    } catch (error) {
      console.error(error);
    } 
  };
  const generateShortForm = (name) => {
    const words = name.split(' ');
    return words.map((word) => {
      if (word.toLowerCase() === 'database') {
        return 'DB';
      }
      
      return word.substring(0, 1).toUpperCase();
    }).join('');
  };
  const getAllcourses = async (id,sessionN) => {
    try {
      console.log(P_Id,sessionN)
      const response = await fetch(
        `${global.apiURL}/Course/GetCoursesProgram?Program_Id=${id}&session=${session}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
     console.log('Courses',data)
     const coursesWithShortForm = data.map(course => ({
      ...course,
      ShortForm: generateShortForm(course.Name),
    }));
    setcourses(coursesWithShortForm);
console.log('short',Courses)
     
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (plosId, courseId,newValue) => {
    if (/^\d*$/.test(newValue)) {
      handleWeightageChange(plosId, courseId, Number(newValue));
    }
  };
 

  

  console.log("weights", weights);
  const handleWeightageChange = (Plo_Id, Course_Id, Weightage) => {
    const existingWeight = weights.find(
      (w) => w.Plo_Id === Plo_Id && w.Course_Id === Course_Id
    );

    if (Weightage === 0) {
      setWeights((weights) =>
        weights.filter((w) => w.Plo_Id !== Plo_Id || w.Course_Id !== Course_Id)
      );
    } else {
      const totalWeightage =
        getColumnTotal(Plo_Id) +
        Weightage -
        (existingWeight ? existingWeight.Weightage : 0);

      if (totalWeightage > 100) {
        Alert.alert(`Total weightage OF PLO  ${totalWeightage} exceeds 100`);
        const latestWeightage =
          100 -
          getColumnTotal(Plo_Id) +
          (existingWeight ? existingWeight.Weightage : 0);
        if (!existingWeight) {
          setWeights((weights) => [
            ...weights,
            {
              Plo_Id: Plo_Id,
              Course_Id: Course_Id,
              Weightage: latestWeightage,
            },
          ]);
        } else {
          setWeights((weights) =>
            weights.map((w) =>
              w === existingWeight ? { ...w, Weightage: latestWeightage } : w
            )
          );
        }
      } else {
        if (existingWeight) {
          setWeights((weights) =>
            weights.map((w) =>
              w === existingWeight ? { ...w, Weightage: Weightage } : w
            )
          );
        } else {
          setWeights((weights) => [
            ...weights,
            { Plo_Id: Plo_Id, Course_Id: Course_Id, Weightage: Weightage },
          ]);
        }
      }
    }
  };
  const getColumnTotal = (Plo_Id) => {
    const cloWeights = weights.filter((w) => w.Plo_Id === Plo_Id);
    const totalWeightage = cloWeights.reduce(
      (acc, cur) => acc + cur.Weightage,
      0
    );
    return totalWeightage;
  };

  const getColumnRemaingTotal = (Plo_Id) => {
    const columnWeightages = weights
      .filter((weight) => weight.Plo_Id === Plo_Id)
      .map((weight) => weight.Weightage);
    const sum = columnWeightages.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const remaining = 100 - sum;
    return remaining >= 0 ? remaining : null;
  };

  

  useEffect(() => {
    getStoredprogram();
    navigation.setOptions({ 
      title: Title ? Title + '   ' + 'Mapping' : 'Loading...', 
      
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
  console.log('Courses',Courses)
   
   
  }, [P_Id, Description,Title,session]);
 

  useEffect(() => {
    let temp = [];
    PLOs.forEach((obj) => {
      Courses.forEach((data) => {
        temp.push({
          Plo_Id: obj.Plo_Id,
          Course_Id: data.C_Id,
          Weightage: 0,
        });
      });
    });
    setNewWeights(temp);
  }, [PLOs, Courses]);
  const checkData = () => {
    const uniquePlo_Id = {};
    const result = weights.reduce((acc, curr) => {
      const { Plo_Id, Weightage } = curr;
      if (!uniquePlo_Id[Plo_Id]) {
        uniquePlo_Id[Plo_Id] = true;
        acc.push({ Plo_Id, Weightage: Weightage });
      } else {
        const index = acc.findIndex((obj) => obj.Plo_Id === Plo_Id);
        acc[index].Weightage += Weightage;
      }
      return acc;
    }, []);
    console.log("result,", result);
    const hasPlo_IdWithValue100 = PLOs.every((item1) =>
      result.some(
        (item2) => item1.Plo_Id == item2.Plo_Id && item2.Weightage == 100
      )
    );
    if (hasPlo_IdWithValue100) {
      return true;
    } else {
      return false;
    }
  };
  const SaveData = () => {

    let result = checkData();
    if (result == true) {
      let updateWeights = weights.filter((obj) => obj.Weightage !== 0);
      const updatedArray = newWeight?.map((item1) => {
        const item2 = updateWeights.find(
          (item2) =>
            item1.Course_Id === item2.Course_Id && item1.Plo_Id === item2.Plo_Id
        );
        if (item2) {
          return { ...item1, Weightage: item2.Weightage };
        }
        return { ...item1 };
      });
addmapping(updatedArray);
      // dispatch(AddPlosMappingAction(weights));
     // dispatch(AddPlosMappingAction(updatedArray));
    } else {
      Alert.alert("Values against some column Plo_Id are not equal to Total 100");
    }
  };
    
    return (
      <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row
                             data={['   '+Title, ...PLOs.map((plos) => plos.Name)]}
                             widthArr={[100,  ...Array(PLOs.length).fill(50)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        <Row
                         
                            data={[
                              "   Total",
                              ...PLOs.map((plos) => {
                                const total = getColumnTotal(plos.Plo_Id);
                                return total === null ? "Total weightage exceeds 100" : `${total}%`;
                              }),
                            ]}
                            widthArr={[100, ...Array(PLOs.length).fill(50)]}

                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows
             
                                    widthArr={[100,  ...Array(PLOs.length).fill(50)]}
                          
              data={[
               ,
                ...Courses.map((course) => [ 
                  <View style={styles.tooltipCell }>
                      <Tooltip
            popover={<Text>{course.Name}</Text>}
            height={null}
            skipAndroidStatusBar={true}
          >
     <Text  numberOfLines={1} style={styles.text1 }> {course.ShortForm}</Text>
     </Tooltip>  
      </View>,
                  ...PLOs.map((plos) => {
                    const weight = weights.find(
                      (weight) =>
                        weight.Plo_Id === plos.Plo_Id &&
                        weight.Course_Id=== course.C_Id
                    );
                    const remainingTotal = getColumnRemaingTotal(plos.Plo_Id);
                    return (
                      <TextInput
                      style={styles.input}
                      value={weight?.Weightage !== undefined && weight?.Weightage !== null ? weight.Weightage : 0}
                     onChangeText={(newValue) => handleChange(plos.Plo_Id, course.C_Id,newValue)}
                      //onBlur={()=> handleWeightageChange(plos.Plo_Id, course.C_Id, Number(value))}
                      name={`cell-${plos.Plo_Id}-${course.C_Id}`}
                      keyboardType="numeric"
                    />
                    );
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
            <TouchableOpacity  style={styles.EditButton} onPress={SaveData}>
              <Text style={styles.text1}>Save</Text>
            </TouchableOpacity>
         

        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 20, backgroundColor: '#fff' },
  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44, backgroundColor: '#3cb371' },
  input:{color:'black'},
  headText: { fontSize: 16,  color: 'white' },
  text: { margin: 6, fontSize: 16, fontWeight: 'bold'  ,color:'black'},
  text: { margin: 6, fontSize: 16, fontWeight: 'bold'  ,color:'black'},
  EditButton: {
    backgroundColor: '#4E944F',
    height: 40,
    marginLeft:20,
    width: '90%',
   marginTop:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:  'bold',
  },
  fixedCell: {
    backgroundColor: '#f8d7',
    color: 'red',
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
  }
  ,
   tooltipCell: {
    backgroundColor: '#3cb371',
    paddingHorizontal: 8,
    paddingVertical: 4,
   height:49,
  },
  text1: {
    
    color: 'white',
    fontSize: 16,
    //marginTop:10,
    fontWeight: 'bold',
  },
});
export default courseplomapping
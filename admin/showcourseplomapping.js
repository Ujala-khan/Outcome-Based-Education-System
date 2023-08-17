import React, { useState ,useEffect} from 'react';
import { StyleSheet, View ,ScrollView,TextInput ,Text,Alert,TouchableOpacity,AsyncStorage} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';
                                                                                                                                             
const showcourseplomapping= ({navigation}) => {
  const [cloploData, setcloploData] = useState([]);
 
  //const[C_Id,setC_Id]=useState('')
 const[CName,setCName]=useState('')

  const [weights, setWeights] = useState([]);
  const [plosName, setPlosName] = useState([]);
  const [courseName, setCourseName] = useState([]);
  const [CourseMappingPlos , setCourseMappingPlos ] = useState([]);



 
  
  
  const GetAllmapping = async (Id,sessionN) => {
    try {
     // console.log('manhos id',C_Id)
      const response = await fetch(
        `${global.apiURL}/CourseMapingPLOs/GetCourseMappedPLOs?progaramID=${Id}&session=${sessionN}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();

     setCourseMappingPlos(data);
     console.log('course h',data)
    } catch (error) {
      console.error(error);
    } 
    console.log('new dataaaaaaaaaaaaa',cloploData)
  };
 
 

    
 


useEffect(() => {
    const fetchData = async () => {
      const storedObject = await AsyncStorage.getItem('program');
      const sessionName = await AsyncStorage.getItem('Session');
     
      console.log('Stored object:', storedObject);
      if (storedObject !== null|| sessionName!==null) {
          const parsedObject = JSON.parse(storedObject);
          console.log('Parsed object:', parsedObject);
        
          
          setCName(parsedObject.Title);
          GetAllmapping(parsedObject.P_Id,sessionName)
        }
      
      navigation.setOptions({ 
        title:' Mapping',
        headerStyle: { backgroundColor: 'green' },
        headerTitleStyle: { fontWeight: 'bold', color:'white' }
      }); // Set the header title
    }
  
    fetchData();
  }, []);





 
useEffect(() => {
    const uniquePlos = CourseMappingPlos.reduce((acc, curr) => {
      const existingPair = acc.find(
        (pair) => pair.Name === curr.ploTitle && pair.Plo_Id === curr.Id
      );
      if (!existingPair) {
        acc.push({
          Plo_Id: curr.Id,
          Name: curr.ploTitle,
          Description: curr.ploDescription,
        });
      }
      return acc;
    }, []);

    const uniqueCourse = CourseMappingPlos.reduce((acc, curr) => {
      const existingPair = acc.find(
        (pair) => pair.Course_Id === curr.Course_Id
      );
      if (!existingPair) {
        const shortForm = curr.courseName.split(" ").map(word => word.charAt(0)).join("");
        acc.push({
          Course_Id: curr.Course_Id,
          Name: curr.courseName,
          ShortForm: shortForm,
        });
      }
      return acc;
    }, []);
    setPlosName(uniquePlos);
    setCourseName(uniqueCourse);
    setWeights(CourseMappingPlos);
    console.log('plo ha',uniquePlos)
    console.log('nam ha',uniqueCourse)
  }, [CourseMappingPlos]);
 
    
    return (
      <View style={styles.container}>
         <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#696969',textAlign:'center',marginBottom:10 }}>{CName}</Text>
           { CourseMappingPlos.length>0?(
           <ScrollView horizontal={true}>
            
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row
                             data={[CName, ...plosName.map((plos) => plos.Name)]}
                             widthArr={[100,  ...Array(plosName.length).fill(44)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows 
                                    widthArr={[100,  ...Array(plosName.length).fill(44)]}
                          
              data={[
               ,
                ...courseName.map((course) => [ 
                  <View style={styles.tooltipCell }>
                  <Tooltip
                    popover={<Text>{course.Name}</Text>}
                    withPointer={false}
                    height={null}
                    skipAndroidStatusBar={true}
                  >
                    <Text style={styles.headText}>{course.ShortForm}</Text>
                  </Tooltip> 
                </View>, 
                
                  ...plosName.map((plos) => {
                    const weight = weights.find(
                        (weight) =>
                          weight.Id === plos.Plo_Id &&
                          weight.Course_Id === course.Course_Id
                      );
                    return weight?.Weightage !== undefined && weight?.Weightage !== 0 ? `${weight.Weightage}%` : '';
                   
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
                      
          ):(<View style={styles.NoData}>
            <Text style={styles.NotDataText}>
           no Mapping yet. Please wait!!!
            </Text>
          </View>)  }
          
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff' },
  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44,backgroundColor: '#2e8b57' },
  input:{color:'black'},
  headText: { margin:2,fontSize: 16, fontWeight:'bold', color: 'white' },
  text: { margin: 6, fontSize: 16  ,color:'black'},
  EditButton: {
    backgroundColor: 'green',
    height: 40,
    marginLeft:20,
    width: '90%',
   marginTop:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  approveBtn: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  approveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  
   tooltipCell: {
    backgroundColor: '#2e8b57',
    paddingHorizontal: 8,
    paddingVertical: 4,
   height:53,
  },
  text1: {
    
    color: 'white',
    fontSize: 16,
    marginTop:10,
    fontWeight: 'bold',
  },
});
export default showcourseplomapping
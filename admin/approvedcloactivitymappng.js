import React, { useState ,useEffect} from 'react';
import { StyleSheet, View ,ScrollView,TextInput ,Text,Alert,TouchableOpacity,AsyncStorage} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';
import clo from '../teacherscreen/clo';
import { Tooltip } from 'react-native-elements';
                                                                                                                                             
const approvedcloactivitymappng= ({navigation}) => {
  const [cloactivityData, setcloactivityData] = useState([]);
  const [typeName, setTypeName] = useState([]);
  const[C_Id,setC_Id]=useState('')
 const[CName,setCName]=useState('')

  //const [plosName, setPlosName] = useState([]);
  const [closName, setClosName] = useState([]);
  const [weights, setWeights] = useState([]);

  
  
  
  
  
  const GetAll = async (Id) => {
    try {
      console.log('manhos id',C_Id)
      const response = await fetch(
        `${global.apiURL}/ActivityMappingCLOs/GetAllActivityCLOsMappingapproved?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();
console.log("datainner",data)
     setcloactivityData(data);
     
    } catch (error) {
      console.error(error);
    } 

  };
  console.log('dataouter',cloactivityData)
  

    // useEffect(()=>{
    //   GetAll(C_Id);
    // },[C_Id])

  useEffect(async () => {
    
   
    const cid= await AsyncStorage.getItem('coursID');
    const cname= await AsyncStorage.getItem('courseName');
   
      console.log('Stored object:', cid,cname);
      if (cid !== null && cname!==null) {
       
       GetAll(cid);
       setCName(cname);
     
       
      }
    
    navigation.setOptions({ title:'CLOActivity Mapping',
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    
   
    
    console.log('cloname',closName);
    
  }, []);
  useEffect(()=>{
    const uniqueType = cloactivityData.reduce((acc, curr) => {
      const existingPair = acc.find((pair) => pair.Type === curr.Type);
      if (!existingPair) {
        acc.push({ Type: curr.Type });
      }
      return acc;
    }, []);
   
    const uniqueClos = cloactivityData.reduce((acc, curr) => {
      const existingPair = acc.find((pair) => pair.Name === curr.Name);
      if (!existingPair) {
        acc.push({ Name: curr.Name });
      }
      return acc;
    }, []);
    setClosName(uniqueClos);
    setTypeName(uniqueType);
    setWeights(cloactivityData);
  },[cloactivityData])



 
    
    return (
      <View style={styles.container}>
          <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#696969',textAlign:'center',marginBottom:10 }}>{CName}</Text>
        { cloactivityData.length>0?(
           <ScrollView horizontal={true}>
          
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row
                             data={['C/A', ...closName.map((clos) => clos.Name)]}
                             widthArr={[100,  ...Array(closName.length).fill(44)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows 
                                    widthArr={[100,  ...Array(closName.length).fill(44)]}
                          
              data={[
               ,
                ...typeName?.map((activity) => [ 
                  <View style={styles.tooltipCell }>
     <Text style={styles.text1 }> {activity.Type}</Text>  
      </View>, 
                
                  
                    ...closName?.map((clos) => {
                        const weight = weights.find(
                          (weight) =>
                            weight.Type === activity.Type && weight.Name === clos.Name
                        );
                        console.log('weight',weight)
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
):(  <View style={styles.NoData}>
    <Text style={styles.NotDataText}>
      activity is not approved. Please wait!!!
    </Text>
  </View>)}
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff' },
  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44, backgroundColor: '#2e8b57' },
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
   tooltipCell: {backgroundColor: '#2e8b57',
    paddingHorizontal: 8,
    paddingVertical: 4,
   height:53,
  },
  text1: {
    
    color: 'white',
    fontSize: 14,
    marginTop:10,
    fontWeight: 'bold',
  },

});
export default approvedcloactivitymappng
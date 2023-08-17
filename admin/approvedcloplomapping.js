import React, { useState ,useEffect} from 'react';
import { StyleSheet, View ,ScrollView,TextInput ,Text,Alert,TouchableOpacity,AsyncStorage} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';
                                                                                                                                             
const approvedcloplomapping= ({navigation}) => {
  const [cloploData, setcloploData] = useState([]);
 
  //const[C_Id,setC_Id]=useState('')
 const[CName,setCName]=useState('')

  const [plosName, setPlosName] = useState([]);
  const [closName, setClosName] = useState([]);
  const [weights, setWeights] = useState([]);



 
  
  
  const GetAllcloplos = async (Id) => {
    try {
     // console.log('manhos id',C_Id)
      const response = await fetch(
        `${global.apiURL}/CLOsPLOsMapping/GetAllCLOsPLOsMappingapproved?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
    const data = await response.json();

     setcloploData(data);
    } catch (error) {
      console.error(error);
    } 
    console.log('new dataaaaaaaaaaaaa',cloploData)
  };
 
 

    
  useEffect(async () => {
    
    const cid= await AsyncStorage.getItem('coursID');
    const cname= await AsyncStorage.getItem('courseName');
   
   
    console.log('Stored object:', cid,cname);
    if (cid !== null && cname!==null) {
     
     GetAllcloplos(cid);
     setCName(cname);
     
    }
  
  navigation.setOptions({ title:'Clo Plo Mapping',
  headerStyle: {
    backgroundColor: 'green'
  }, headerTitleStyle: {
    fontWeight: 'bold',
    color:'white' //Set Header text style
  },}); // Set the header title
  
 
  console.log('cloname',CName);
  console.log('cloname',closName);
  
}, []);

 
  useEffect(() => {
    const uniquePlos = cloploData.reduce((acc, curr) => {
      const existingPair = acc.find(
        (pair) =>
          pair.Name === curr.Name && pair.Plo_Id === curr.Plo_Id
      );
      if (!existingPair) {
        acc.push({ Plo_Id: curr.Plo_Id, Name: curr.Name });
      }
      return acc;
    }, []);
    const uniqueClos = cloploData.reduce((acc, curr) => {
      const existingPair = acc.find((pair) => pair.Clo_Id === curr.Clo_Id);
      if (!existingPair) {
        acc.push({ Clo_Id: curr.Clo_Id, Name: curr.cloname });
      }
      return acc;
    }, []);
    
    setPlosName(uniquePlos);
    setClosName(uniqueClos);
    setWeights(cloploData);
   
  }, [cloploData]);

 
    
    return (
      <View style={styles.container}>
         <Text style={{ fontSize: 18, fontWeight: 'bold',color:'#696969',textAlign:'center',marginBottom:10 }}>{CName}</Text>
           { cloploData.length>0?(
           <ScrollView horizontal={true}>
            
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row
                             data={['C/P', ...plosName.map((plos) => plos.Name)]}
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
                ...closName.map((clos) => [ 
                  <View style={styles.tooltipCell }>
     <Text style={styles.text1 }> {clos.Name}</Text>  
      </View>, 
                
                  ...plosName.map((plos) => {
                    const weight = weights.find(
                      (weight) =>
                        weight.Plo_Id === plos.Plo_Id &&
                        weight.Clo_Id === clos.Clo_Id
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
            ClOs PLOs Mapping is not approved. Please wait!!!
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
export default approvedcloplomapping
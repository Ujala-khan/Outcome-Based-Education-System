import React, { useState ,useEffect} from 'react';
import { StyleSheet, View ,ScrollView,TextInput ,Text,Alert,alert,TouchableOpacity,AsyncStorage} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';
                                                                                                                                             
const cloplomapping = ({navigation}) => {
  const [cloData, setcloData] = useState([]);
  const[C_Id,setC_Id]=useState('')
 const[CName,setCName]=useState('')

  const [weights, setWeights] = useState([]);
  const [PLOsData, setPLOsData] = useState([]);
  const [value, setValue] = useState("");


  const addmapping = async (list) => {
  
 
    
    try {
    
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',list)
fetch(`${global.apiURL}/CLOsPLOsMapping/MappingCLOsonPLOs`, {
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

  const getStoredcourse = async () => {
    try {
      const cid= await AsyncStorage.getItem('coursID');
      const cname= await AsyncStorage.getItem('courseName');
     
      console.log('Stored object:', cid,cname);
      if (cid !== null && cname!==null) {
       
        console.log('Parsed object cid:', cid);
        console.log('Parsed object name:', cname);
        setC_Id(cid);
        setCName(cname);
        
        console.log('State variables:', C_Id, CName);
        GetAllPLOs(cid);
        getAllcols(cid);
      }
    } catch (e) {
      console.log('Error getting stored object:', e);
    }
  };

  const getAllcols = async (C_Id) => {
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
    } 
  };
  
  const GetAllPLOs = async (C_Id) => {
    try {
      const response = await fetch(
        `${global.apiURL}/CLOsPLOsMapping/GetPLOsOfCourses?courseID=${C_Id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
      setPLOsData(data);
       console.log('dataaaaaaaaaaaaa',PLOsData)
     
    } catch (error) {
      console.error(error);
    } 
  };
  const handleChange = (plosId, cloId,newValue) => {
    if (/^\d*$/.test(newValue)) {
      handleWeightageChange(plosId, cloId, Number(newValue));
    }
  };

  const handleBlur = () => {
    handleWeightageChange(plos.Plo_Id, course.C_Id, Number(value));
  };

  const NumberFormatCustom = (props) => {
    const { inputRef, ...otherProps } = props;
  
    return (
      <TextInput
        ref={inputRef}
        {...otherProps}
        keyboardType="numeric"
        maxLength={6}
      />
    );
  };
  
  
  console.log("weights", weights);
 
  
  const handleWeightageChange = (ploId, cloId, weightage) => {
    console.log("weightage", weightage);
    const existingWeight = weights.find(
      (w) => w.Plo_Id === ploId && w.Clo_Id === cloId
    );

    if (weightage === 0) {
      setWeights((weights) =>
        weights.filter((w) => w.Plo_Id !== ploId || w.Clo_Id !== cloId)
      );
    } else {
      const totalWeightage =
        getColumnTotal(cloId) +
        weightage -
        (existingWeight ? existingWeight.Weightage : 0);

      if (totalWeightage > 100) {
        Alert.alert('', `Weightage ${weightage} exceeds total Weightage of 100`)
        const latestWeightage =
          100 -
          getColumnTotal(cloId) +
          (existingWeight ? existingWeight.Weightage : 0);
        if (!existingWeight) {
          setWeights((weights) => [
            ...weights,
            { Plo_Id: ploId, Clo_Id: cloId, Weightage: latestWeightage },
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
              w === existingWeight ? { ...w, Weightage: weightage } : w
            )
          );
        } else {
          setWeights((weights) => [
            ...weights,
            { Plo_Id: ploId, Clo_Id: cloId, Weightage: weightage },
          ]);
        }
      }
    }
  };

  const getColumnTotal = (cloId) => {
    const cloWeights = weights.filter((w) => w.Clo_Id === cloId);
    const totalWeightage = cloWeights.reduce(
      (acc, cur) => acc + cur.Weightage,
      0
    );
    return totalWeightage;
  };

  const getColumnRemaingTotal = (cloId) => {
    const columnWeightages = weights
      .filter((weight) => weight.Clo_Id === cloId)
      .map((weight) => weight.Weightage);
    const sum = columnWeightages.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const remaining = 100 - sum;
    return remaining >= 0 ? remaining : null;
  };
  const checkData = () => {
    const uniqueCIds = {};
    const result = weights.reduce((acc, curr) => {
      const { Clo_Id, Weightage } = curr;
      if (!uniqueCIds[Clo_Id]) {
        uniqueCIds[Clo_Id] = true;
        acc.push({ Clo_Id, Weightage: Weightage });
      } else {
        const index = acc.findIndex((obj) => obj.Clo_Id === Clo_Id);
        acc[index].Weightage += Weightage;
      }
      return acc;
    }, []);
    const hasCloidWithValue100 = cloData.every((item1) =>
      result.some(
        (item2) => item1.Clo_Id == item2.Clo_Id && item2.Weightage == 100
      )
    );
    if (hasCloidWithValue100) {
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
            item1.Clo_Id === item2.Clo_Id && item1.Plo_Id === item2.Plo_Id
        );
        if (item2) {
          return { ...item1, Weightage: item2.Weightage, Status: "pending" };
        }
        return { ...item1, Status: "pending" };
      });
      addmapping(updatedArray);
    //  dispatch(AddClosPlosMappingAction(updatedArray));
    } else {
      Alert.alert("Values against some row Clo_Id are not equal to Total 100");
    }
  };

  

  useEffect(() => {
    getStoredcourse();
    navigation.setOptions({ title:'CLO PLO Mapping',
    headerStyle: {
      backgroundColor: 'green'
    }, headerTitleStyle: {
      fontWeight: 'bold',
      color:'white' //Set Header text style
    },}); // Set the header title
    console.log('C_Id:', C_Id);
    console.log('CNAME:', CName);
    
   
  }, [C_Id,CName]);
  const [newWeight, setNewWeights] = useState([]);
  useEffect(() => {
    let temp = [];
    PLOsData.forEach((obj) => {
      cloData.forEach((data) => {
        temp.push({
          Plo_Id: obj.Plo_Id,
          Clo_Id: data.Clo_Id,
          Weightage: 0,
          Course_Id: C_Id,
        });
      });
    });
    setNewWeights(temp);
  }, [PLOsData]);
 
    
    return (
      <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Row
                             data={[<View >
                              <Tooltip
                    popover={<Text>{CName}</Text>}
                    height={null}
                    skipAndroidStatusBar={true}
                  >
             <Text  numberOfLines={1} style={styles.text1}> {CName}</Text>
             </Tooltip>  
              </View>,"Total", ...PLOsData.map((plos) => plos.Name)]}
                             widthArr={[100,  ...Array(PLOsData.length).fill(44)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows
                                    widthArr={[100,  ...Array(PLOsData.length).fill(44)]}
                          
              data={[
               ,
                ...cloData.map((course) => [ 
                  <View style={styles.tooltipCell }>
     <Text style={styles.text1 }> {course.Name}</Text>  
      </View>, `${
                  getColumnTotal(course.Clo_Id) === null
                    ? 'Total weightage exceeds 100'
                    : getColumnTotal(course.Clo_Id)
                }%`,
                  ...PLOsData.map((plos) => {
                    const weight = weights.find(weight => weight.Plo_Id === PLOsData.Plo_Id && weight.Clo_Id=== cloData.Clo_Id);
                    return (
                      <TextInput
                      style={styles.input}
                      value={weight?.Weightage !== undefined && weight?.Weightage !== null ? weight.Weightage : 0}
                      onChangeText={(newValue) => handleChange(plos.Plo_Id, course.Clo_Id,newValue)}
                     // onBlur={()=> handleWeightageChange(plos.Plo_Id, course.Clo_Id, Number(value))}
                      name={`cell-${plos.Plo_Id}-${course.Clo_Id}`}
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
              <Text>Save</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
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
export default cloplomapping
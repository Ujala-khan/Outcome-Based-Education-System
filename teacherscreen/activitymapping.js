import React, { useState,useEffect } from 'react';
import { StyleSheet, View ,ScrollView,TextInput ,Alert,alert,AsyncStorage,Text,TouchableOpacity} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';


const courseplomapping = ({navigation}) => {
    const [weights, setWeights] = useState([]);
    const[C_Id,setC_Id]=useState('')
    const[CName,setCName]=useState('')
  
  const [value, setValue] = useState("");
  const [cloData, setcloData] = useState([]);
  const [activity, setActivity] = useState([
    {
      Activity_Id: 1,
      Type: "Quiz",
    },
    {
      Activity_Id: 2,
      Type: "Assignment",
    },
    {
      Activity_Id: 3,
      Type: "presentation",
    },
    {
      Activity_Id: 4,
      Type: "Mid Exam",
    },
    {
      Activity_Id: 5,
      Type: "Final Exam",
    },
  ]);

  const addmapping = async (list) => {
  
 
    
    try {
    
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',list)
fetch(`${global.apiURL}/ActivityMappingCLOs/CLOsMappingActivity`, {
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
      console.log('ohhakd',cloData.Clo_Id)
    } catch (error) {
      console.error(error);
    } 
  };


 
  const handleChange = (cloId,activity,newValue) => {
    if (/^\d*$/.test(newValue)) {
      handleWeightageChange(cloId,activity, Number(newValue));
    }
  };

 

  

  console.log("weights", weights);
  const handleWeightageChange = (cloId, Type, weightage) => {
    const existingWeight = weights.find(
      (w) => w.Type === Type && w.Clo_Id === cloId
    );

    if (weightage === 0) {
      setWeights((weights) =>
        weights.filter((w) => w.Type !== Type || w.Clo_Id !== cloId)
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
            { Type: Type, Clo_Id: cloId, Weightage: latestWeightage },
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
            { Type: Type, Clo_Id: cloId, Weightage: weightage },
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
    //  total  calculate weightage each id against
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
          (item2) => item1.Clo_Id === item2.Clo_Id && item1.Type === item2.Type
        );
        if (item2) {
          return {
            ...item1,
            Weightage: item2.Weightage,
          };
        }
        return { ...item1 };
      });
      addmapping(updatedArray);
     // dispatch(AddClosActivityMappingAction(updatedArray));
    } else {
      Alert.alert("Values against some Column Clo_Id are not equal to Total 100");
    }
  };

  useEffect(() => {
    getStoredcourse();
    navigation.setOptions({ title:'Activity Mapping',
    headerStyle: {
      backgroundColor: 'green'

    }, headerTitleStyle: {
     
      color:'white' //Set Header text style
    },}); // Set the header title
    console.log('C_Id:', C_Id);
    console.log('CNAME:', CName);
    
   
  }, [C_Id,CName]);
  const [newWeight, setNewWeights] = useState([]);
  useEffect(() => {
    let temp = [];
    cloData.forEach((obj) => {
      activity.forEach((item) => {
        temp.push({
          Type: item.Type,
          Clo_Id: obj.Clo_Id,
          Weightage: 0,
          Status: "pending",
          Course_Id: C_Id,
        });
      });
    });
    setNewWeights(temp);
  }, [cloData]);

   
    return (
      <View style={styles.container}>
            <ScrollView horizontal={true} stickyHeaderIndices={0}>
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
              </View>, ...cloData.map((clos) => clos.Name)]}
                             widthArr={[100,  ...Array(cloData.length).fill(50)]}
                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        <Row
                            data={[
                              "Total",
                              ...cloData.map((clos) => {
                                const total = getColumnTotal(clos.Clo_Id);
                                return total === null ? "Total weightage exceeds 100" : `${total}%`;
                              }),
                            ]}
                            widthArr={[100, ...Array(cloData.length).fill(50)]}

                            style={styles.head}
                            textStyle={styles.headText}
                        />
                        
                    
                    </Table>
                    <ScrollView>
                        <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
                        <Rows
                                    widthArr={[100,  ...Array(cloData.length).fill(50)]}
                          
              data={[
               ,
                ...activity.map((activity) =>[  <View style={styles.tooltipCell }>
     <Text style={styles.text1 }> {activity.Type}</Text>  
      </View>,
                  ...cloData.map((clos) => {
                    const weight = weights.find(
                      (weight) =>
                        weight.Clo_Id === cloData.Clo_Id &&
                        weight.Activity_Id=== activity.Activity_Id
                    );
                    const remainingTotal = getColumnRemaingTotal(clos.Clo_Id);
                    return (
                      <TextInput
                      style={styles.input}
                      value={weight?.Weightage !== undefined && weight?.Weightage !== null ? weight.Weightage : 0}
                      onChangeText={(newValue) => handleChange(clos.Clo_Id, activity.Type,newValue)}

                   //   onBlur={()=> handleWeightageChange(clos.Clo_Id, activity.Type, Number(value))}
                      name={`cell-${cloData.Clo_Id}-${activity.Activity_Id}`}
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
  headText: { fontSize: 16,  color: 'white' },
  text: { margin: 6, fontSize: 16, fontWeight: 'bold'  ,color:'black'},
  text: { margin: 6, fontSize: 16, fontWeight: 'bold'  ,color:'black'},
  EditButton: {
    backgroundColor: 'green',
    height: 40,
    marginLeft:20,
    width: '90%',
   marginTop:10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight:  'bold',
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
  stickyColumn: {
    backgroundColor: '#2e8b57',
    position: "sticky",
   
  },
   tooltipCell: {
    backgroundColor: '#2e8b57',
    paddingHorizontal: 8,
    paddingVertical: 4,
   height:49,
  },
  text1: {
    
    color: 'white',
    fontSize: 14,
    marginTop:10,
    fontWeight: 'bold',
  },
});
export default courseplomapping
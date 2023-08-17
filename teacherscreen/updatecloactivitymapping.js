import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert, TouchableOpacity, AsyncStorage, Modal, Pressable } from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Tooltip } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Value } from 'react-native-reanimated';

const updatecloactivitymapping = ({ navigation }) => {
  const [cloactivityData, setcloactivityData] = useState([]);
  const [typeName, setTypeName] = useState([]);
  const [C_Id, setC_Id] = useState('')
  const [CName, setCName] = useState('')
  const [suggustion, setsuggustion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [plosName, setPlosName] = useState([]);
  const [closName, setClosName] = useState([]);
  const [weights, setWeights] = useState([]);

  console.log("weights===",weights)
  const [inputText, setInputText] = useState(0);

  const AddClosActivityMappingAction= async (list) => {



    try {

      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', C_Id)
      const apiUrl = `${global.apiURL}/ActivityMappingCLOs/CLOsMappingActivity`;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(list)
      };
      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (response.ok) {
            // Request successful, handle the response here
            Alert.alert('updated')
            console.log('API request successful');
          } else {
            // Request failed, handle the error here
            console.log('API request failed');
          }
        })
        .catch((error) => {
          // Network or other errors occurred, handle them here
          console.error('Error occurred during API request:', error);
        });

   

    } catch (error) {
      console.error(error);
    }


  };

 



  const GetAll = async (Id) => {
    try {
      console.log('manhos id', C_Id)
      const response = await fetch(
        `${global.apiURL}/ActivityMappingCLOs/GetAllActivityCLOsMapping?courseID=${Id}`,
        {
          method: 'GET',
        }
      );
      const data = await response.json();
     
      setcloactivityData(data);

    } catch (error) {
      console.error(error);
    }

  };



  // useEffect(()=>{
  //   GetAll(C_Id);
  // },[C_Id])

  const handleChange = (newValue) => {
    console.log("text", newValue)
    if (/^\d*$/.test(newValue)) {
      console.log(newValue);
     setInputText(newValue);
    } else {
      // Display an error message or handle the invalid input here
      console.log('Invalid input');
    }
  };

  const handleWeightageChange = (cloId, Type, id, weightage) => {
    const existingWeight = weights.find((w) => w.Id === id);
  
    if (weightage === '0' || /^\d+$/.test(weightage)) {
      const newWeightage = Number(weightage);
  
      console.log("existingWeight", existingWeight);
      console.log("weights", weights);
      if (newWeightage === 0) {
        const index = weights.findIndex((w) => w.Id === id);
        if (index !== -1) {
          setWeights((weights) => {
            const newWeights = [...weights];
            newWeights[index].Weightage = 0;
            return newWeights;
          });
        }
      } else {
        const totalWeightage =
          getColumnTotal(cloId) +
          newWeightage -
          (existingWeight ? Number(existingWeight.Weightage) : 0);
  
        if (totalWeightage > 100) {
         Alert.alert(`Total weightage for CLO ${cloId} exceeds 100`);
          const latestWeightage =
            100 -
            getColumnTotal(cloId) +
            (existingWeight ? Number(existingWeight.Weightage) : 0);
          if (!existingWeight) {
            setWeights((weights) => [
              ...weights,
              { Type: Type, Clo_Id: cloId, Weightage: Number(latestWeightage )},
            ]);
          } else {
            setWeights((weights) =>
              weights.map((w) =>
                w === existingWeight ? { ...w, Weightage: Number(latestWeightage) } : w
              )
            );
          }
        } else {
          if (existingWeight) {
            const index = weights.findIndex((w) => w.Id === id);
            if (index !== -1) {
              setWeights((weights) => {
                const newWeights = [...weights];
                newWeights[index].Weightage = Number(weightage);
                return newWeights;
              });
            }
            // setWeights((weights) =>
            //   weights.map((w) =>
            //     w === existingWeight ? { ...w, Weightage: weightage } : w
            //   )
            // );
          } else {
            setWeights((weights) => [
              ...weights,
              { Type: Type, Clo_Id: cloId, Weightage: weightage },
            ]);
          }
        }
      }
    } else {
      // Display an error message or handle the invalid input here
      console.log('Invalid input');
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
    const hasCloidWithValue100 = closName?.every((item1) =>
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

  useEffect(async () => {


    const cid = await AsyncStorage.getItem('coursID');
    const cname = await AsyncStorage.getItem('courseName');

    console.log('Stored object:', cid, cname);
    if (cid !== null && cname !== null) {

      GetAll(cid);
      setCName(cname);


    }

    navigation.setOptions({
      title: 'CLO_Activity Mapping',
      headerStyle: {
        backgroundColor: 'green'
      }, headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white' //Set Header text style
      },
    }); // Set the header title



    console.log('cloname', closName);

  }, []);

  useEffect(() => {
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
        acc.push({
          Clo_Id: curr.Clo_Id,
          Name: curr.Name,
          Description: curr.Description,
        });
      }
      return acc;
    }, []);
    setClosName(uniqueClos);
    console.log('cloname', closName);
    setTypeName(uniqueType);
    setWeights(cloactivityData);
  }, [cloactivityData])


  const SaveData = () => {

    let result = checkData();
    if (result == true) {
      let updateWeights = weights.filter((obj) => obj.Weightage !== 0);
      const updatedArray = cloactivityData?.map((item1) => {
        const item2 = updateWeights.find(
          (item2) => item1.Clo_Id === item2.Clo_Id && item1.Type === item2.Type
        );
        if (item2) {
          return {
            ...item1,
            Weightage: item2.Weightage,
            Status: "Pending",
            Suggestion: null,
          };
        }
        return { ...item1, Status: "Pending", Suggestion: null };
      });
      

      AddClosActivityMappingAction(updatedArray)

    } else {
      Alert.alert(
        "Values against some Column Clo_Id are not equal to Total 100"
      );
    }
  };



  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#696969', textAlign: 'center', marginBottom: 10 }}>{CName}</Text>
      <TouchableOpacity style={[styles.EditButton]} onPress={() => setModalVisible(true)}>
        <View style={{flexDirection: 'row',}}>
      <Icon name="commenting-o" size={20} color="#fff" style={{marginRight:10}} />
        <Text style={{marginLeft:2,fontWeight:'bold'}}>Suggestion</Text></View>
      </TouchableOpacity>
      <ScrollView horizontal={true} style={{ marginTop: 10 }}>

        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
            <Row
              data={['C/A', ...closName.map((clos) => clos.Name)]}
              widthArr={[100, ...Array(closName.length).fill(50)]}
              style={styles.head}
              textStyle={styles.headText}
            />

<Row
          data={["Remaining",
                              ...closName.map((clos) => {
                                const total = getColumnRemaingTotal(clos.Clo_Id);
                                return total === null ? "0%" : `${getColumnRemaingTotal(clos.Clo_Id)}%`;
                              }),
                            ]}
                            widthArr={[100, ...Array(closName.length).fill(50)]}

                            style={styles.head}
                            textStyle={styles.headText}
                        />


          </Table>
          <ScrollView>
            <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>

              <Rows
                widthArr={[100, ...Array(closName.length).fill(50)]}

                data={[
                  ,
                  ...typeName?.map((activity) => [<View style={styles.tooltipCell}>
                    <Text style={styles.text1}> {activity.Type}</Text>
                  </View>,


                  ...closName?.map((clos) => {
                    const weight = weights.find(
                      (weight) =>
                        weight.Type === activity.Type && weight.Name === clos.Name
                    );
                    return (
                      <TextInput
                        key={`${clos.Clo_Id}-${activity.Type}`}
                        style={styles.input}
                        keyboardType="numeric"

                        defaultValue={
                          weight?.Weightage !== undefined &&
                            weight?.Weightage !== 0 &&
                            weight?.Weightage !== null
                            ? weight.Weightage.toString()
                            : '0'
                        }
                        
                        onChangeText={(text) => handleChange(text)}
                        onBlur={() => {
                          handleWeightageChange(clos.Clo_Id, activity.Type, weight.Id, inputText);
                        }}
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

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={[styles.EditButton]} onPress={SaveData}>
          <Text>update</Text>
        </TouchableOpacity>


      </View>
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
                setModalVisible(!modalVisible);
              }}>
              <MaterialCommunityIcons name="close-thick" size={25} color="black" />
            </Pressable>
            <Text style={styles.ModalHeaderText}>Suggestion</Text>

            <Text style={styles.text}>{cloactivityData[0]?.Suggestion}</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff' },
  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44, backgroundColor: '#3cb371' },
  input: { color: 'black', fontSize: 10 },
  headText: { margin: 2, fontSize: 16, fontWeight: 'bold', color: 'white' },
  text: { margin: 6, fontSize: 16, color: 'black' },
  EditButton: {
    backgroundColor: 'green',
    height: 40,
    marginLeft: 70,
    width: '60%',
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
  ,
  tooltipCell: {
    backgroundColor: '#3cb371',
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 56,
  },
  text1: {

    color: 'white',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: 320,
    width: 300,
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
    marginBottom: 20,
    color: 'white',
    backgroundColor: '#49c658',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#49c658',
    width: 70,
    alignSelf: 'flex-end',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  InputFields: {
    height: '25%',
    width: '90%',
    marginBottom: 10,
  },


  modalButton2: {
    borderRadius: 20,
    elevation: 2,
    alignSelf: 'flex-end',
  }
});
export default updatecloactivitymapping
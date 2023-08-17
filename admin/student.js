import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, AsyncStorage ,Modal,Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, Row, Rows } from 'react-native-table-component';
import { Tooltip } from 'react-native-elements';

const student = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [ploN, setploN] = useState('');
  const [transcriptData, setTranscriptData] = useState([]);
  const [cloweightage, setcloweightage] = useState([]);
  const [studentData, setstudentData] = useState([]);
  const [courseNames, setCourseNames] = useState([]);
  const [ploNames, setPloNames] = useState([]);

  const getStoredProgram = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('aridno');
      if (storedUser !== null) {
        console.log('aridno',storedUser)
        setUser(storedUser);
        getTranscriptData(storedUser);
        getstudentData(storedUser);
      }
    } catch (error) {
      console.log('Error getting stored object:', error);
    }
  };
  
  const getstudentData = async (id) => {
    try {
      console.log(user)
      const response = await fetch(
        `${global.apiURL}/Transcript/studentdata?aridno=${id}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
     setstudentData(data);
      console.log('student RESULt',data)
      console.log('result',transcriptData)
    } catch (error) {
      console.error(error);
    }
  };


  const getTranscriptData = async (id) => {
    try {
      console.log(user)
      const response = await fetch(
        `${global.apiURL}/Transcript/GetStudentTranscript?aridNo=${id}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      setTranscriptData(data);
      console.log('data RESULt',data)
      console.log('result',transcriptData)
    } catch (error) {
      console.error(error);
    }
  };
  const getclosweightage = async (course,plo) => {
    try {
      console.log('course name and plo is ',course,plo);
      setploN(plo)
      const response = await fetch(
        `${global.apiURL}/Transcript/GetPLOsCLOsRsult?aridNo=${user}&courseID=${course}&ploName=${plo}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
     setcloweightage(data);
      console.log('clo weitage',data)
      console.log('clo weitage',cloweightage)
      setModalVisible(true)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(async () => {
    
    
    const storedUser = await AsyncStorage.getItem('aridno');
  
      console.log('Stored object:', storedUser);
      if (storedUser !== null ) {
       
      
       setUser(storedUser);
       getTranscriptData(storedUser);
       getstudentData(storedUser);
     
       
      }
    
      navigation.setOptions({
        title: 'Student Result',
        headerStyle: {
          backgroundColor: 'green',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
        },
      });
    
   
    
   
    
  }, []);

  useEffect(() => {
    let courseName = Object.keys(transcriptData).map((name) => {
      const [course, courseId] = name.split('#');
      return { course, courseId };
    });
    console.log('course hn', courseName);
    setCourseNames(courseName);
  
    let plosNameSet = new Set();
    courseName.forEach((courseObj) => {
      const { course } = courseObj;
      let plos = Object.keys(transcriptData[`${course}#${courseObj.courseId}`]);
      console.log("plos", plos);
      plos.forEach((plo) => plosNameSet.add(plo));
    });
  
    let plosNameArray = Array.from(plosNameSet);
    plosNameArray.sort((a, b) => {
      const ploNumberA = parseInt(a.replace("PLO", ""));
      const ploNumberB = parseInt(b.replace("PLO", ""));
      return ploNumberA - ploNumberB;
    });
  
    setPloNames(plosNameArray);
  }, [transcriptData, studentData]);
  
   const [totalObtained, setTotalObtained] = useState({});
  const [totalPercentage, setTotalPercentage] = useState({});

  useEffect(() => {
    if (transcriptData && ploNames.length > 0 ) {
      const totalObtainedPercentage = {};
      const totalTotalPercentage = {};

      ploNames.forEach((plos) => {
        let totalObtained = 0;
        let totalTotal = 0;

        courseNames.forEach((course) => {
          const ploWeight = transcriptData[`${course.course}#${course.courseId}`][plos];
          if (ploWeight && ploWeight.ObtainedPercentage !== null) {
            totalObtained += ploWeight.ObtainedPercentage;
            totalTotal += ploWeight.TotalPercentage;
          }
        });

        totalObtainedPercentage[plos] = totalObtained;
        totalTotalPercentage[plos] = totalTotal;
      });

      setTotalObtained(totalObtainedPercentage);
      setTotalPercentage(totalTotalPercentage);
    }
  }, [transcriptData, courseNames, ploNames]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {studentData.map((student) => (
          <View style={styles.infoRow} key={student.aridno}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>{student.Student_Name}</Text>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Arid_NO: {student.Arid_Number}</Text>
              <Text style={styles.infoLabel}>Semester: {student.Semester} {student.Section}</Text>
              <Text style={styles.infoLabel}>Session: {student.Session}</Text>
            </View>
          </View>
        ))}
      </View>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
            <Row
              data={['Result', ...ploNames?.map(plos => plos)]}
              widthArr={[100, ...Array(ploNames.length).fill(60)]}
              style={styles.head}
              textStyle={styles.headText}
            />
          </Table>
          <ScrollView>
            <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
              <Rows
                widthArr={[100, ...Array(ploNames.length).fill(60)]}
                data={[
                  ...courseNames?.map((course) => [
                    <View style={styles.tooltipCell}>
                      <Tooltip
                        popover={<Text>{course.course}</Text>}
                        withPointer={false}
                        height={null}
                        skipAndroidStatusBar={true}
                      >
                        <Text style={styles.text1}>{course.course}</Text>
                      </Tooltip>
                    </View>,
                    ...ploNames?.map((plos) => {
                      const ploWeight = transcriptData[`${course.course}#${course.courseId}`][plos];
                      const obtainedPercentage = ploWeight?.ObtainedPercentage;
                      const totalPercentage = ploWeight?.TotalPercentage;
                      const fiftyPercent = totalPercentage * 0.5;
                      const showGreenText = obtainedPercentage > fiftyPercent;
                      const showRedText = obtainedPercentage < fiftyPercent;
                      return (
                        <View>
                          {obtainedPercentage !== null && (
                            <TouchableOpacity onPress={()=>{getclosweightage(course.courseId,plos)}}>
                            <Text
                              style={{
                                color: showGreenText ? 'green' : showRedText ? 'red' : 'inherit',
                              }}
                            >
                              {ploWeight &&
                                obtainedPercentage !== null &&
                                `${obtainedPercentage?.toFixed(2)}/${totalPercentage}`}
                            </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    }),
                  ]),
                ]}
                textStyle={styles.text}
              />
              <Row
                data={[
                  'Total',
                  ...ploNames?.map((plos) => {
                    return (
                      <View>





                    
                        {totalObtained[plos] !== undefined && totalPercentage[plos] !== undefined ? (
                          <Text
                            style={{
                              color: totalObtained[plos] < 50 ? 'red' : 'inherit',
                            }}
                          >
                            {totalObtained[plos].toFixed(2)}/{totalPercentage[plos]}
                          </Text>
                        ) : null}
                      </View>
                    );
                  }),
                ]}
                widthArr={[100, ...Array(ploNames.length).fill(60)]}
                style={styles.head}
                textStyle={styles.headText}
              />
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
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
            <Text style={styles.ModalHeaderText}>Weightage against {ploN}</Text>


        
  
  <ScrollView>
  {Object.entries(cloweightage).map(([clo, data]) => {
    const totalPercentage = data.TotalPercentage;
    const obtainedPercentage = data.ObtainedPercentage;

    return (
      <View  key={clo}>
        <Text style={{color:'green',fontSize:14,fontWeight:'bold'}}>{clo}</Text>
        <Text style={{color:'black',fontSize:14}}>
          Total : {totalPercentage}%, Obtained : {obtainedPercentage}%
        </Text>
      </View>
    );
  })}
  </ScrollView>

            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 7, paddingTop: 10 },
  infoContainer: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    // flexDirection: 'row',
    marginBottom: 5,
  },
  infoColumn: {
    marginRight: 10,
  },
  infoLabel: {
    color: 'black',
    fontWeight: 'bold',
  },
  infoValue: {
    marginBottom: 5,
  },

  rowSection: { height: 60, backgroundColor: '#E7E6E1' },
  head: { height: 44, backgroundColor: '#3cb371' },
  input: { color: 'black' },
  headText: { margin: 2, fontSize: 16, fontWeight: 'bold', color: 'white' },
  text: { margin: 6, fontSize: 16, color: 'black' },
  
  EditButton: {
    backgroundColor: 'green',
    height: 40,
    marginLeft: 10,
    width: '40%',
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipCell: {
    backgroundColor: '#3cb371',
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 53,
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
    width: 170,
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 10,
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

 


  modalButton2: {
    borderRadius: 20,
    elevation: 2,
    alignSelf: 'flex-end',
  }
});

export default student;
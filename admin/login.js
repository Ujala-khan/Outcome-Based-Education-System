import React, {useState,useEffect} from 'react';
import {TextInput, RadioButton} from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  AsyncStorage,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';



import logo from '../images/logo.jpg';

const login = ({navigation}) => {
  const[user,setuser]=useState(null)
  const[email,setEmail]=useState(null)
  const[password,setPassword]=useState(null)
  
  
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const handleSubmit = async () => {
    try {
      console.log(email,password)
      const response = await fetch(
        `${global.apiURL}/Auth/User?username=${email}&password=${password}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      console.log(data[0]);
      setuser(data[0]);
      if (data[0].Role === 'admin') {
        AsyncStorage.setItem('user',data[0].Role); 
        navigation.navigate('program');
      } else if (data[0].Role === 'student') {
        AsyncStorage.setItem('aridno',data[0].Username); 
        AsyncStorage.setItem('Role',data[0].Role); 
        navigation.navigate('student');
      } else if (data[0].Role === 'teacher') {
        AsyncStorage.setItem('user',data[0].Username); 
        AsyncStorage.setItem('Role',data[0].Role); 
        navigation.navigate('teacher', { Username: data[0].Username });
      }else if (data[0].Role === 'parent') {
        AsyncStorage.setItem('Role',data[0].Role); 
        navigation.navigate('parent', { Username: data[0].Username });
      }
  
      console.log(user, 'iiiiiiiiiiiiiiii');
  
      
     
    } catch (error) {
      console.log('ERROR: LoginHandler');
      Alert.alert(
        'Invalid email or password',
        '',
        [{text: 'OK'}],
        {
          backgroundColor: '#FF0000', // change the background color here
          color: '#FFFFFF', // change the text color here
        }
      );
    }
  };
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage successfully cleared!');
    } catch (e) {
      console.log('Failed to clear AsyncStorage:', e);
    }

  };
 
  useEffect(() => {
  clearAsyncStorage();
  }, []);
  
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        

        <View style={styles.inputWrapper}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logo} resizeMode="cover" />
        </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputFields}
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={value => setEmail(value)}
              placeholderTextColor="#D1D1D1"
              autoFocus={true}
              fontSize={16}
            />

            <TextInput
              style={styles.inputFields}
              mode="outlined"
              label="Password"
              secureTextEntry={isPasswordSecure}
              value={password}
              onChangeText={value => setPassword(value)}
              right={
                <TextInput.Icon
                  icon="eye"
                  onPress={() =>
                    setIsPasswordSecure(!isPasswordSecure)
                  }
                />
              }
              placeholderTextColor="#D1D1D1"
              fontSize={16}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems:'center'
    ,marginTop:10
  },
  logo: {

    width: 120,
    height: 120,
    //tintColor: '#FFFFFF'
  },
  inputWrapper: {
    width: '100%',
    
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
   //shadowRadius: 1,
    elevation: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputFields: {
    marginBottom: 10,
    color: '#444444',
  },
  button: {
    width: '100%',
    backgroundColor: '#6FBF73',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default login;
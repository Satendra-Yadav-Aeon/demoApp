import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import BackgroundService from 'react-native-background-actions';
import Colors from '../../../assets/colors/colors'
import MyImages from '../../../utils/MyImages'
import EmployeeCategory from './EmployeeCategory'
import EmployeeShowAttendance from './EmployeeShowAttendance'
import { ROLES, SCREENS } from '../../../constants/MainConstant'
import { getAsyncItem } from '../../../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'
import { getLanguageLabel } from '../../../utils/getLanguageLabel'
import CustomChangeLanguage from '../../../common/CustomChangeLanguage'
import useGetEmployeeDetailsById from '../hooks/useGetEmployeeDetailsById'
import useGetEmployeeTodayAttendance from '../hooks/useGetEmployeeTodayAttendance'
import { extractAttendanceTimes } from '../../../utils/extractAttendanceTimesUtils'
import { BaseConfigUrl } from '../../../env/BaseConfigUrl'
import { useSaveBackgroundLocation } from '../hooks/useSaveBackgroundLocation';


const EmployeeDashboard = () => {
  const navigation = useNavigation()
  const {i18n} = useTranslation();
  const { employeeDetails, refetch } = useGetEmployeeDetailsById();
  const { empAttendance, refetchAttendance } = useGetEmployeeTodayAttendance();
  const[employeeData, setEmployeeData] = useState({})
  const [isLangModalVisible, setLangModalVisible] = useState(false);
  const[capturedImageUri, setCapturedImageUri] = useState()
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLong, setCurrentLong] = useState(null);
  const {saveBackgroundLocation} = useSaveBackgroundLocation()

  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const { firstCheckIn, lastCheckOut } = extractAttendanceTimes(empAttendance);
    
  useEffect(() => {
    fetchAsyncData();
    fetchLocation();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useFocusEffect(
    React.useCallback(() => {
      if (employeeData?.empid) {
        refetch({ empid: employeeData?.empid });
        refetchAttendance({userId: employeeData?.empid});
      }
    }, [employeeData])
  );

  useFocusEffect(
    React.useCallback(() => {
        const loadProfileImage = async () => {
          // First try using the fetched employeeDetails  
          if (employeeDetails?.photo) {
            setCapturedImageUri(`${BaseConfigUrl.BASE_IMAGE_URL}${employeeDetails.photo}`);
            return;
          }
          // Otherwise, fallback to async stored image
          if(employeeData?.empid){
            const key = `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employeeData?.empid}`
            const uri = await getAsyncItem(key);
            if (uri) {
              setCapturedImageUri(uri);
            }
          }
          
        };
        
          loadProfileImage();
      }, [employeeDetails, employeeData])
  );

  const fetchLocation = async () => {
    const userLat = parseFloat(await getAsyncItem(ASYNC_CONSTANT.USER_LAT)) || null;
    const userLong = parseFloat(await getAsyncItem(ASYNC_CONSTANT.USER_LONG)) || null;
    setCurrentLat(userLat);
    setCurrentLong(userLong);
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    const saveBackgroundData = {
      empid: employeeData?.empid,
      currentlat: currentLat,
      currentlong: currentLong
    }
    
    // console.log('===veryIntensiveTask=>>saveBackgroundData>>',saveBackgroundData);
    
      // Example of an infinite loop task
      const { delay } = taskDataArguments;
      await new Promise( async (resolve) => {
          for (let i = 0; BackgroundService.isRunning(); i++) {
              console.log(i);
              await saveBackgroundLocation(saveBackgroundData);
              await sleep(delay);
          }
      });
  };


  const options = {
      taskName: 'Example',
      taskTitle: 'Attendrix Background Location',
      taskDesc: 'Attendrix background location Service enabled',
      taskIcon: {
          name: 'screen',
          type: 'drawable',
          package: 'com.demoapp'
      },
      color: '#ff00ff',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
          delay: 5000,
      },
  };

  const startBackgroundLocationService = async() => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({taskDesc: 'Attendrix background location service running '});
  }

  const stopBackgroundLocationService = async() => {
    await BackgroundService.stop();
  }
   
    // console.log('====EmployeeDashboard===>>>empAttendance>>>>',employeeData);

  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => setLangModalVisible(true)} style={styles.languageButton}>
          <Text style={styles.languageText} adjustsFontSizeToFit={true}>{getLanguageLabel(i18n.language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.PROFILE, {employee: employeeDetails})} style={styles.profileContainer}>
          {capturedImageUri ? (
            <Image source={{uri: capturedImageUri}} style={styles.roundImage}/>
          ) : (
            <Image source={MyImages.profile} style={styles.profileIcon}/>
          )}
        </TouchableOpacity>
        <View style={styles.employeeDataContainer}>
          <Text style={styles.employeeName}>{employeeData?.empname}</Text>
          <Text style={styles.employeeEmail}>{employeeData?.rolename}</Text>
        </View>
        <EmployeeShowAttendance checkIn={firstCheckIn} checkOut={lastCheckOut} employeeDetails={employeeDetails}/>
      </View>
      <View style={styles.secondHalf}>
        <EmployeeCategory role={ROLES.EMPLOYEE}/>
        <View style={styles.powerButtons}>
          <TouchableOpacity onPress={startBackgroundLocationService}>
            <Image source={MyImages.power} style={styles.powerIcon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopBackgroundLocationService}>
            <Image source={MyImages.powerOn} style={styles.powerIcon}/>
          </TouchableOpacity>
        </View>         
      </View>
      <CustomChangeLanguage visible={isLangModalVisible} onClose={() => setLangModalVisible(false)} />
    </View>
  )
}

export default EmployeeDashboard

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    firstHalf: {
      flex:2,
      backgroundColor: Colors.red,
    },
    secondHalf: {
      flex:3,
      backgroundColor: Colors.bgColor
    },
    textStyle: {
      fontSize: 30
    },
    settingContainer: {
      position: 'absolute',
      top: 25,
      right: 15,
      backgroundColor: Colors.bgColor,
      height: 40,
      width: 40,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },
    settingIcon: {
      width:24, 
      height:24, 
      tintColor: Colors.black
    },
    profileContainer: {
      position: 'absolute',
      top: 80,
      left: 30,
    },
    profileIcon: {
      width: 70, 
      height: 70,
      marginTop: 10 
    },
    employeeDataContainer: {
      position: 'absolute',
      top: 95,
      left: 100,
      width: '70%',
      marginLeft: 10
    },
    employeeName: {
      fontSize: 25,
      fontWeight: 'bold',
      color: Colors.white
    },
    employeeEmail: {
      fontSize: 16,
      color: Colors.white
    },
    languageButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
      backgroundColor: Colors.white,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 6,
      elevation: 3,
      marginTop: 15
    },
    languageText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.black,
      textAlign: 'center',
    },
    roundImage: {
      width: 70,
      height: 70,
      borderRadius: 35, // Half of width/height
      borderWidth: 2,
      borderColor: Colors.white,
      marginTop: 10
    },
    powerButtons: {
      flexDirection: 'row', 
      justifyContent: 'space-between'
    },
    powerIcon: {
      width: 45, 
      height: 45,
      margin: 50,
    },
})
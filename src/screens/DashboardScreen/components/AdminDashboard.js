import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Colors from '../../../assets/colors/colors'
import MyImages from '../../../utils/MyImages'
import EmployeeCategory from './EmployeeCategory'
import { ROLES, SCREENS } from '../../../constants/MainConstant'
import { getAsyncItem } from '../../../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'
import CustomChangeLanguage from '../../../common/CustomChangeLanguage'
import { getLanguageLabel } from '../../../utils/getLanguageLabel'
import useGetEmployeeDetailsById from '../hooks/useGetEmployeeDetailsById'
import { BaseConfigUrl } from '../../../env/BaseConfigUrl'
import { NotificationContext } from '../context/NotificationContext'

const AdminDashboard = () => {
  const navigation = useNavigation()
  const {i18n} = useTranslation();
  const { employeeDetails, refetch } = useGetEmployeeDetailsById();
  const[employeeData, setEmployeeData] = useState({})
  const [isLangModalVisible, setLangModalVisible] = useState(false);
  const[capturedImageUri, setCapturedImageUri] = useState()
  const { unreadCount, refetchNotification } = useContext(NotificationContext);
    
  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useFocusEffect(
    React.useCallback(() => {
      if (employeeData?.empid) {
        refetch({ empid: employeeData?.empid });
        refetchNotification({ adminId: employeeData.empid });
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
     
      // console.log('====AdminDashboard===>>>capturedImageUri>>>>',capturedImageUri);
  
  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <View style={styles.topRightContainer}>
          <TouchableOpacity onPress={() => setLangModalVisible(true)} style={styles.languageButton}>
            <Text style={styles.languageText}>{getLanguageLabel(i18n.language)}</Text>
          </TouchableOpacity>
          {/* Notification Icon with Count */}
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.NOTIFICATION)}
            style={styles.notificationWrapper}
          >
            <Image source={MyImages.notification} style={styles.notificationIcon}/>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
      </View>
      <View style={styles.secondHalf}>
        <EmployeeCategory role={ROLES.ADMIN}/>
      </View>
      <CustomChangeLanguage visible={isLangModalVisible} onClose={() => setLangModalVisible(false)} />
    </View>
  )
}

export default AdminDashboard

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    firstHalf: {
      flex:2,
      backgroundColor: Colors.red,
    },
    secondHalf: {
      flex:5,
      backgroundColor: Colors.bgColor
    },
    notificationIcon: {
      width:30, 
      height:30, 
      tintColor: Colors.white,
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
      backgroundColor: Colors.white,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 6,
      elevation: 3,
    },
    languageText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.black,
      textAlign: 'center'
    },
    roundImage: {
      width: 70,
      height: 70,
      borderRadius: 35, // Half of width/height
      borderWidth: 2,
      borderColor: Colors.white,
      marginTop: 10
    },
    topRightContainer: {
      position: 'absolute',
      top: 40,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      zIndex: 10,
      marginTop: 15
    },
    notificationWrapper: {
      position: 'relative',
      marginRight: 10,
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: 'red',
      borderRadius: 8,
      paddingHorizontal: 4,
      minWidth: 16,
      alignItems: 'center',
    },
    badgeText: {
      color: 'white',
      fontSize: 14,
    },
    })
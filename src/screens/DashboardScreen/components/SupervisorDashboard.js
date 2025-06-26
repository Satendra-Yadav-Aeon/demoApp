import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Colors from '../../../assets/colors/colors'
import MyImages from '../../../utils/MyImages'
import EmployeeCategory from './EmployeeCategory'
import { ROLES, SCREENS } from '../../../constants/MainConstant'
import EmployeeShowAttendance from './EmployeeShowAttendance'
import { getAsyncItem } from '../../../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant'

const SupervisorDashboard = () => {
  const navigation = useNavigation()
  const[employeeData, setEmployeeData] = useState({})
  
  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SETTING)} style={styles.settingContainer}>
          <Image source={MyImages.setting} style={styles.settingIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(SCREENS.PROFILE)} style={styles.profileContainer}>
          <Image source={MyImages.profile} style={styles.profileIcon}/>
        </TouchableOpacity>
        <View style={styles.employeeDataContainer}>
          <Text style={styles.employeeName}>{employeeData?.name}</Text>
          <Text style={styles.employeeEmail}>{employeeData?.rolename}</Text>
        </View>
        <EmployeeShowAttendance/>
      </View>
      <View style={styles.secondHalf}>
        <EmployeeCategory role={ROLES.SUPERVISOR}/>
      </View>
    </View>
  )
}

export default SupervisorDashboard

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
    }
})
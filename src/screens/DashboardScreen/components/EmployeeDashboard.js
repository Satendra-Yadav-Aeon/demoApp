import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Colors from '../../../assets/colors/colors'
import MyImages from '../../../utils/MyImages'
import { PROFILE_SCREEN, SETTING_SCREEN } from '../../../constants/MainConstant'
import EmployeeAttendance from './EmployeeAttendance'

const EmployeeDashboard = () => {
  const navigation = useNavigation()
  const[employeeData] = useState({
    name: 'Lionel Messi',
    email: 'lionelMessi68@gmail.com'

  })
  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.navigate(SETTING_SCREEN)} style={styles.settingContainer}>
          <Image source={MyImages.setting} style={styles.settingIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(PROFILE_SCREEN)} style={styles.profileContainer}>
          <Image source={MyImages.profile} style={styles.profileIcon}/>
        </TouchableOpacity>
        <View style={styles.employeeDataContainer}>
          <Text style={styles.employeeName}>{employeeData?.name}</Text>
          <Text style={styles.employeeEmail}>{employeeData?.email}</Text>
        </View>
        <EmployeeAttendance/>
      </View>
      <View style={styles.secondHalf}>
        {/* <Text style={styles.textStyle}>second half</Text> */}
      </View>
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
      width: 60, 
      height: 60, 
    },
    employeeDataContainer: {
      position: 'absolute',
      top: 83,
      left: 100,
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
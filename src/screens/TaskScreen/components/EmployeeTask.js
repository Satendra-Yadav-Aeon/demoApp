import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { EMPLOYEE_TASK_TITLE, SUPERVISOR_TASK_TITLE } from '../constants/EmployeeTaskConstant'
import MyImages from '../../../utils/MyImages'
import Colors from '../../../assets/colors/colors'
import ManageTaskList from './ManageTaskList'

const EmployeeTask = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const { employee} = route.params || {};
  const {t} = useTranslation()
  // console.log('===EmployeeTask==>>employee>>>',employee);
  
  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>{employee ? SUPERVISOR_TASK_TITLE : EMPLOYEE_TASK_TITLE}</Text>
      </View>
      <View style={styles.secondHalf}>
        <ManageTaskList employee={employee}/>
      </View>
    </View>
  )
}

export default EmployeeTask

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Colors.red,
  },
  firstHalf: {
    flex:1,
    backgroundColor: Colors.red,
    justifyContent: 'center',
  },
  secondHalf: {
    flex:5,
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderColor: Colors.bgColor,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
    marginLeft: 10,
  }
})
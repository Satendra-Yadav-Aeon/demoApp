import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import MyImages from '../../../utils/MyImages'
import Colors from '../../../assets/colors/colors'
import { CATERGORY_CONSTANT } from '../../DashboardScreen/constants/DashboardConstant'
import AdminTaskList from './AdminTaskList'

const AdminTask = () => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>{t(CATERGORY_CONSTANT.EMPLOYEE_TASK)}</Text>
      </View>
      <View style={styles.secondHalf}>
        <AdminTaskList/>
      </View>
    </View>
    
  )
}

export default AdminTask

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
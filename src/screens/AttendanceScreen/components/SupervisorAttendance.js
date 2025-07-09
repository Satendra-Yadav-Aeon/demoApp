import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import MyImages from '../../../utils/MyImages'
import { MARK_ATTENDANCE_TITLE } from '../constants/AttendanceConstant'
import Colors from '../../../assets/colors/colors'
import MarkAttendanceEmployeeList from './MarkAttendanceEmployeeList'
import { SELF_TASK } from '../../DashboardScreen/constants/DashboardConstant'
import { SCREENS } from '../../../constants/MainConstant'
import ScreenDimensions from '../../../utils/DimensionUtils'

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.25;

const SupervisorAttendance = () => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const handleTask = () => {
    navigation.navigate(SCREENS.EMPLOYEE_TASK);
  };
  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>{t(MARK_ATTENDANCE_TITLE)}</Text>
      </View>
      <View style={styles.secondHalf}>
        <TouchableOpacity style={styles.card} onPress={handleTask}>
          <Image source={MyImages.add} style={styles.icon}/>
          <Text style={styles.cardText}>{SELF_TASK}</Text>
        </TouchableOpacity>
        <MarkAttendanceEmployeeList/>
      </View>
    </View>
  )
}

export default SupervisorAttendance

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
    alignItems: 'flex-end'
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
  },
  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    margin: 10,
    padding: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.red,
    marginTop: 10,
    width: '100%',
    textAlign: 'center'
  },
  icon: {
    width: 30, 
    height: 30, 
    tintColor: Colors.red
  },
})    
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import { REPORT_CONSTANT } from '../constants/ReportConstant';
import { SCREENS } from '../../../constants/MainConstant';

const Report = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.heading}>{REPORT_CONSTANT.REPORT_TITLE}</Text>
      </View>
      <View style={styles.bodyContainer}>
      <TouchableOpacity style={styles.reportButtons} onPress={() => navigation.navigate(SCREENS.ATTENDANCE_REPORT)}>
        <Text style={styles.btnText}>{REPORT_CONSTANT.ATTENDANCE_REPORT}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reportButtons} onPress={() => navigation.navigate(SCREENS.TASK_REPORT)}>
        <Text style={styles.btnText}>{REPORT_CONSTANT.TASK_REPORT}</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default Report

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  headingContainer: {
    marginTop: 30 
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.red,
    marginLeft: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.red,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  reportButtons: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: Colors.red,
    padding: 15,
    borderColor: Colors.bgColor,
    margin: 10
  },
  btnText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  }
})
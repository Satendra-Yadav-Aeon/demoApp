import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyImages from '../../../utils/MyImages'
import { REPORT_CONSTANT } from '../constants/ReportConstant'
import Colors from '../../../assets/colors/colors'

const TaskReport = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.heading}>{REPORT_CONSTANT.TASK_REPORT}</Text>
      </View>
    </View>
  )
}

export default TaskReport

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
  }
})  
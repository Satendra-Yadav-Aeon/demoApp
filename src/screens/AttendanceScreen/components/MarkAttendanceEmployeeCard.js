import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { MANAGE_EMPLOYEE_CONSTANT } from '../../EmployeeScreen/constants/ManageEmployeeConstant';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import { SCREENS } from '../../../constants/MainConstant';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const MarkAttendanceEmployeeCard = ({ employee }) => {
  const [isCheckIn, setIsCheckIn] = useState(true);
  const navigation = useNavigation()
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{employee?.name}</Text>
        <Image source={MyImages.profile} style={styles.profileIcon}/>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{MANAGE_EMPLOYEE_CONSTANT.MOBILE}</Text>
        <Text style={styles.dataText}>{employee?.mobile}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{MANAGE_EMPLOYEE_CONSTANT.DEPARTMENT}</Text>
        <Text style={styles.dataText}>{employee?.department}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{MANAGE_EMPLOYEE_CONSTANT.ROLE}</Text>
        <Text style={styles.dataText}>{employee?.role}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{MANAGE_EMPLOYEE_CONSTANT.JOINING_DATE}</Text>
        <Text style={styles.dataText}>{employee?.joiningDate}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{MANAGE_EMPLOYEE_CONSTANT.ADDRESS}</Text>
        <Text style={styles.dataText}>{employee?.address}</Text>
      </View>
      <TouchableOpacity style={styles.setLocationButton} onPress={() => navigation.navigate(SCREENS.SET_EMPLOYEE_ATTENDANCE,{isCheckIn: isCheckIn})}>
        <Text style={styles.setLocationText}>{MANAGE_EMPLOYEE_CONSTANT.SET_ATTENDANCE}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MarkAttendanceEmployeeCard;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    padding: 15,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  dataRow: {
    flexDirection: 'row',
    gap: 10
  },
  profileIcon: {
    height: 50,
    width: 50,
  },
  headerText: {
    fontSize: 16,
    color: Colors.grey,
    fontWeight: '700'
  },
  dataText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '700'
  },
  setLocationButton: {
    backgroundColor: Colors.red,
    margin: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  setLocationText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
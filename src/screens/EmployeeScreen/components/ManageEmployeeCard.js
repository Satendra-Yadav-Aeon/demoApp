import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MyImages from '../../../utils/MyImages';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { MANAGE_EMPLOYEE_CONSTANT } from '../constants/ManageEmployeeConstant';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const ManageEmployeeCard = ({ employee, onEdit }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{employee?.name}</Text>
        <TouchableOpacity onPress={() => onEdit(employee)}>
          <Image source={MyImages.edit} style={styles.editIcon}/>
        </TouchableOpacity>
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
    </View>
  );
};

export default ManageEmployeeCard;

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
  editIcon: {
    height: 40,
    width: 40,
    tintColor: Colors.grey
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
  }
});
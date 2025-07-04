import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import MyImages from '../../../utils/MyImages';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { MANAGE_EMPLOYEE_CONSTANT } from '../constants/ManageEmployeeConstant';
import { formatDate } from '../../../utils/formatDateUtils';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const ManageEmployeeCard = ({ employee, onEdit }) => {
  const {t} = useTranslation()
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{employee?.empname}</Text>
        <TouchableOpacity onPress={() => onEdit(employee)}>
          <Image source={MyImages.edit} style={styles.editIcon}/>
        </TouchableOpacity>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.MOBILE)}</Text>
        <Text style={styles.dataText}>{employee?.mobileno}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.ROLES)}</Text>
        <Text style={styles.dataText}>{employee?.rolename}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.REPORTING_MANAGER)}</Text>
        <Text style={styles.dataText}>{employee?.repomanager}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.JOINING_DATE)}</Text>
        <Text style={styles.dataText}>{formatDate(employee?.joiningdate)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.ADDRESS)}</Text>
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
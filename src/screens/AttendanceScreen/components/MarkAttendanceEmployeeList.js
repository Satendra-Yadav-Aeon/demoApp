import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import MarkAttendanceEmployeeCard from './MarkAttendanceEmployeeCard';
import { ManageEmployeeData } from '../../EmployeeScreen/constants/ManageEmployeeData';
import Colors from '../../../assets/colors/colors';
import { ATTENDANCE_CONSTANT } from '../constants/AttendanceConstant';


const MarkAttendanceEmployeeList = () => {
  const filterEmployeeData = ManageEmployeeData?.filter(item => item.role === ATTENDANCE_CONSTANT.EMPLOYEE_ROLE)
  return (
    <View style={styles.container}>
      <FlatList
        data={filterEmployeeData}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <MarkAttendanceEmployeeCard employee={item}/>
        )}
      />
    </View>
  );
};

export default MarkAttendanceEmployeeList;

const styles = StyleSheet.create({
  container: { 
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    marginTop: 20,
    marginBottom: 20
  },
  addIcon: {
    alignItems: 'flex-end',
    margin: 15,
  },
  addIconStyle: {
    height: 50,
    width: 50,
    tintColor: Colors.red
  }
});
import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import MarkAttendanceEmployeeCard from './MarkAttendanceEmployeeCard';
import { ManageEmployeeData } from '../../EmployeeScreen/constants/ManageEmployeeData';
import Colors from '../../../assets/colors/colors';
import { ATTENDANCE_CONSTANT } from '../constants/AttendanceConstant';
import useGetAllEmployee from '../../EmployeeScreen/hooks/useGetAllEmployee';
import MyImages from '../../../utils/MyImages';
import { isArrayLength } from '../../../utils/ValidationUtils';


const MarkAttendanceEmployeeList = () => {
  const {manageEmployeeData} = useGetAllEmployee();
  const filterEmployeeData = ManageEmployeeData?.filter(item => item.role === ATTENDANCE_CONSTANT.EMPLOYEE_ROLE)

  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isArrayLength(filterEmployeeData) ? (
        <FlatList
          data={filterEmployeeData}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <MarkAttendanceEmployeeCard employee={item}/>
          )}
      />
      ) : (
        renderEmptyData()
      )}
    </View>
  );
};

export default MarkAttendanceEmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataIcon: {
    height: 100,
    width: 100,
  }
});
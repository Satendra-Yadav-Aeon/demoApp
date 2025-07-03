import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MarkAttendanceEmployeeCard from './MarkAttendanceEmployeeCard';
import { ManageEmployeeData } from '../../EmployeeScreen/constants/ManageEmployeeData';
import Colors from '../../../assets/colors/colors';
import { ATTENDANCE_CONSTANT } from '../constants/AttendanceConstant';
import MyImages from '../../../utils/MyImages';
import { isArrayLength } from '../../../utils/ValidationUtils';
import useGetSupervisorsEmployeeAPI from '../hooks/useGetSupervisorsEmployeeAPI';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';



const MarkAttendanceEmployeeList = () => {
  const {supervisorsEmployeeList, refetchSupervisorEmployeeList} = useGetSupervisorsEmployeeAPI();
  const[employeeData, setEmployeeData] = useState({})
  // const filterEmployeeData = ManageEmployeeData?.filter(item => item.role === ATTENDANCE_CONSTANT.EMPLOYEE_ROLE)

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useFocusEffect(
    React.useCallback(() => {
      refetchSupervisorEmployeeList({userId: employeeData?.empid});
    }, [employeeData])
  );

  console.log('==MarkAttendanceEmployeeList===>supervisorsEmployeeList>>>>',supervisorsEmployeeList, employeeData?.empid);
  

  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isArrayLength(supervisorsEmployeeList) ? (
        <FlatList
          data={supervisorsEmployeeList}
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
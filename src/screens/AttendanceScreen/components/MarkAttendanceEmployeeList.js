import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MarkAttendanceEmployeeCard from './MarkAttendanceEmployeeCard';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import { isArrayLength } from '../../../utils/ValidationUtils';
import useGetSupervisorsEmployeeAPI from '../hooks/useGetSupervisorsEmployeeAPI';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import ScreenDimensions from '../../../utils/DimensionUtils';

const {screenWidth} = ScreenDimensions
const MarkAttendanceEmployeeList = () => {
  const {supervisorsEmployeeList, refetchSupervisorEmployeeList} = useGetSupervisorsEmployeeAPI();
  const[employeeData, setEmployeeData] = useState({})

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
          keyExtractor={(item) => item?.userId}
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
    marginTop: 10,
    marginBottom: 20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth*1
  },
  noDataIcon: {
    height: 100,
    width: 100,
  }
});
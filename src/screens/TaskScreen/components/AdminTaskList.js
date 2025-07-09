import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useGetAllEmployee from '../../EmployeeScreen/hooks/useGetAllEmployee';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import MyImages from '../../../utils/MyImages';
import Colors from '../../../assets/colors/colors';
import AdminTaskCard from './AdminTaskCard';
import { isArrayLength } from '../../../utils/ValidationUtils';

const AdminTaskList = () => {
  const {manageEmployeeData, refetch} = useGetAllEmployee()
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
      if(employeeData?.empid){
        refetch({admnId: employeeData?.empid});
      }
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
      {isArrayLength(manageEmployeeData) ? (
        <FlatList
          data={manageEmployeeData}
          keyExtractor={(item) => item?.empid}
          renderItem={({ item }) => (
            <AdminTaskCard employee={item}/>
          )}
        />
      ) : (
        renderEmptyData()
      )}
    </View>
  );
};

export default AdminTaskList;

const styles = StyleSheet.create({
  container: { 
    flex:1,
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
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

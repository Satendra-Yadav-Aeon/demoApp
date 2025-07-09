import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { SCREENS } from '../../../constants/MainConstant';
import { MANAGE_EMPLOYEE_CONSTANT } from '../../EmployeeScreen/constants/ManageEmployeeConstant';
import MyImages from '../../../utils/MyImages';
import Colors from '../../../assets/colors/colors';
import { isArrayLength } from '../../../utils/ValidationUtils';
import ManageTaskCard from './ManageTaskCard';
import useGetTaskDetailsAPI from '../hooks/useGetTaskDetailsAPI';

const ManageTaskList = ({employee}) => {
  const navigation = useNavigation();
  const {taskData, refetchTaskDetails} = useGetTaskDetailsAPI()
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
      if(employee){
        refetchTaskDetails({empId: employee?.empid});
      }
      if(employeeData?.empid){
        refetchTaskDetails({empId: employeeData?.empid});
      }
    }, [employee, employeeData])
  );

  const handleAddEmployee = () => {
    navigation.navigate(SCREENS.MANAGE_TASK_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.ADD_MODE, attendanceSelf: !employee, });
  };

  const handleEditEmployee = (task) => {
    navigation.navigate(SCREENS.MANAGE_TASK_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE, task, attendanceSelf: !employee });
  };

  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addIcon} onPress={handleAddEmployee}>
        <Image source={MyImages.add} style={styles.addIconStyle}/>
      </TouchableOpacity>
      {isArrayLength(taskData) ? (
        <FlatList
          data={taskData}
          keyExtractor={(item) => item?.taskId}
          renderItem={({ item }) => (
            <ManageTaskCard task={item} onEdit={handleEditEmployee} />
          )}
        />
      ) : (
        renderEmptyData()
      )}
    </View>
  );
};

export default ManageTaskList;

const styles = StyleSheet.create({
  container: { 
    flex:1,
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
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
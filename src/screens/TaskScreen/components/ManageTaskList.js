import React, { useState } from 'react';
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

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchAndRefetch = async () => {
        let empId;
        if (employee?.userId || employee?.empid) {
          empId = employee?.userId || employee?.empid;
        } else {
          const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
          if (isActive) {
            setEmployeeData(data);
          }
          empId = data?.empid;
        }
        if (empId && isActive) {
          refetchTaskDetails({ empId });
        }
      };

      fetchAndRefetch();
      return () => {
        isActive = false;
      };
    }, [employee])
  );

  const handleAddEmployee = () => {
    navigation.navigate(SCREENS.MANAGE_TASK_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.ADD_MODE, attendanceSelf: !employee, employee });
  };

  const handleEditEmployee = (task) => {
    navigation.navigate(SCREENS.MANAGE_TASK_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE, task, attendanceSelf: !employee , employee });
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
      {!employee?.admnId && (
        <TouchableOpacity style={styles.addIcon} onPress={handleAddEmployee}>
          <Image source={MyImages.add} style={styles.addIconStyle}/>
        </TouchableOpacity>
      )}
      {isArrayLength(taskData) ? (
        <FlatList
          data={taskData}
          keyExtractor={(item) => item?.taskId}
          renderItem={({ item }) => (
            <ManageTaskCard task={item} onEdit={handleEditEmployee} employee={employee}/>
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
import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../../constants/MainConstant';
import MyImages from '../../../utils/MyImages';
import Colors from '../../../assets/colors/colors';
import ManageEmployeeCard from './ManageEmployeeCard';
import { MANAGE_EMPLOYEE_CONSTANT } from '../constants/ManageEmployeeConstant';
import useGetAllEmployee from '../hooks/useGetAllEmployee';
import { isArrayLength } from '../../../utils/ValidationUtils';


const ManageEmployeeList = () => {
  const navigation = useNavigation();
  const {manageEmployeeData, refetch} = useGetAllEmployee()

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleAddEmployee = () => {
    navigation.navigate(SCREENS.MANAGE_EMPLOYEE_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.ADD_MODE });
  };

  const handleEditEmployee = (employee) => {
    navigation.navigate(SCREENS.MANAGE_EMPLOYEE_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE, employee });
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
      {isArrayLength(manageEmployeeData) ? (
        <FlatList
          data={manageEmployeeData}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <ManageEmployeeCard employee={item} onEdit={handleEditEmployee} />
          )}
        />
      ) : (
        renderEmptyData()
      )}
    </View>
  );
};

export default ManageEmployeeList;

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
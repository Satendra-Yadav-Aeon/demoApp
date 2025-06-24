import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../../constants/MainConstant';
import MyImages from '../../../utils/MyImages';
import { ManageEmployeeData } from '../constants/ManageEmployeeData';
import Colors from '../../../assets/colors/colors';
import ManageEmployeeCard from './ManageEmployeeCard';
import { MANAGE_EMPLOYEE_CONSTANT } from '../constants/ManageEmployeeConstant';


const ManageEmployeeList = () => {
  const navigation = useNavigation();

  const handleAddEmployee = () => {
    navigation.navigate(SCREENS.MANAGE_EMPLOYEE_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.ADD_MODE });
  };

  const handleEditEmployee = (employee) => {
    navigation.navigate(SCREENS.MANAGE_EMPLOYEE_FORM, { mode: MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE, employee });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addIcon} onPress={handleAddEmployee}>
        <Image source={MyImages.add} style={styles.addIconStyle}/>
      </TouchableOpacity>

      <FlatList
        data={ManageEmployeeData}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <ManageEmployeeCard employee={item} onEdit={handleEditEmployee} />
        )}
      />
    </View>
  );
};

export default ManageEmployeeList;

const styles = StyleSheet.create({
  container: { 
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    marginBottom: 100
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
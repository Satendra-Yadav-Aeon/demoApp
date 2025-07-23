import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import useGetAllEmployee from '../../EmployeeScreen/hooks/useGetAllEmployee';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import MyImages from '../../../utils/MyImages';
import { isArrayLength } from '../../../utils/ValidationUtils';
import Colors from '../../../assets/colors/colors';
import SetEmployeeLocationCard from './SetEmployeeLocationCard';
import { SET_LOCATION_CONSTANT } from '../constants/SetLocationConstants';
import { SCREENS } from '../../../constants/MainConstant';

const SetEmployeeLocationList = () => {
  const navigation = useNavigation();
  const {manageEmployeeData, refetch} = useGetAllEmployee()
  const[employeeData, setEmployeeData] = useState({})
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
      // Reset selection every time screen is focused
      setSelectedEmployees([]);
      setSelectAll(false);
    }, [employeeData])
  );

  const renderEmptyData = () => {
    return(
      <View style={styles.emptyContainer}>
        <Image source={MyImages.noData} style={styles.noDataIcon}/>
      </View>
    )
  }

  const toggleSelectAll = (newValue) => {
    setSelectAll(newValue);
    if (newValue) {
      setSelectedEmployees(manageEmployeeData); // all selected
    } else {
      setSelectedEmployees([]);
    }
  };

  const toggleEmployeeSelect = (employee) => {
    const exists = selectedEmployees?.find(emp => emp.empid === employee.empid);
    if (exists) {
      setSelectedEmployees(selectedEmployees?.filter(emp => emp.empid !== employee.empid));
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleSetLocation = () => {
    if (!selectedEmployees.length) {
      Alert.alert(SET_LOCATION_CONSTANT.NO_EMPLOYEE_SELECTED);
      return;
    }
    navigation.navigate(SCREENS.EMPLOYEE_GEOFENCE_LOCATION, { selectedEmployees });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.setLocationButton} onPress={handleSetLocation}>
          <Text style={styles.setLocationText}>{SET_LOCATION_CONSTANT.SET_GEOFENCE}</Text>
        </TouchableOpacity>
        <CheckBox value={selectAll} onValueChange={toggleSelectAll} tintColors={{ true: Colors.red }} style={{marginRight: 15}} />
      </View>
      {isArrayLength(manageEmployeeData) ? (
        <FlatList
          data={manageEmployeeData}
          keyExtractor={(item) => item?.empid}
          renderItem={({ item }) => (
            <SetEmployeeLocationCard 
            employee={item}
            isSelected={selectedEmployees?.some(emp => emp.empid === item.empid)}
            onToggleSelect={toggleEmployeeSelect}
            />
          )}
        />
      ) : (
        renderEmptyData()
      )}
    </View>
  );
};

export default SetEmployeeLocationList;

const styles = StyleSheet.create({
  container: { 
    flex:1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    paddingTop:10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataIcon: {
    height: 100,
    width: 100,
  },
  setLocationButton: {
    backgroundColor: Colors.red,
    margin: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  setLocationText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

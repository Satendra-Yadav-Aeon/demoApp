import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';
import MyImages from '../../../utils/MyImages';
import { MANAGE_EMPLOYEE_CONSTANT } from '../../EmployeeScreen/constants/ManageEmployeeConstant';
import { formatDate } from '../../../utils/formatDateUtils';
import Colors from '../../../assets/colors/colors';
import { CHECK_TASK, MANAGE_TASK } from '../../DashboardScreen/constants/DashboardConstant';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../../../constants/MainConstant';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const AdminTaskCard = ({ employee }) => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const[profileImageUri, setProfileImageUri] = useState()

  useEffect(() => {
    if (employee?.photo) {
      setProfileImageUri(`${BaseConfigUrl.BASE_IMAGE_URL}${employee.photo}`);
    }

  },[employee])

  // console.log('===AdminTaskCard==>>employee>>>>', employee);
  
  const handleTask = () => {
    navigation.navigate(SCREENS.EMPLOYEE_TASK, {
    employee,
    });
  };
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{employee?.empname}</Text>
        {profileImageUri ? (
          <Image source={{uri: profileImageUri}} style={styles.roundImage}/>
        ) : (
          <Image source={MyImages.profile} style={styles.profileIcon}/>
        )}
      </View>
      {/* <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.MOBILE)}</Text>
        <Text style={styles.dataText}>{employee?.mobileno}</Text>
      </View> */}
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.ROLES)}</Text>
        <Text style={styles.dataText}>{employee?.rolename}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.REPORTING_MANAGER)}</Text>
        <Text style={styles.dataText}>{employee?.repomanager}</Text>
      </View>
      {/* <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.JOINING_DATE)}</Text>
        <Text style={styles.dataText}>{formatDate(employee?.joiningdate)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.ADDRESS)}</Text>
        <Text style={styles.dataText}>{employee?.address}</Text>
      </View> */}
      <TouchableOpacity style={styles.setLocationButton} onPress={handleTask}>
        <Text style={styles.setLocationText}>{t(CHECK_TASK)}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminTaskCard;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    padding: 15,
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 0.5,
    flexWrap: 'wrap',
  },
  dataRow: {
    flexDirection: 'row',
  },
  editIcon: {
    height: 40,
    width: 40,
    tintColor: Colors.grey
  },
  headerText: {
    fontSize: 16,
    color: Colors.grey,
    fontWeight: '700',
    width: '35%'
  },
  dataText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '700',
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  profileIcon: {
    height: 50,
    width: 50,
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

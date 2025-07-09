import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { MANAGE_EMPLOYEE_CONSTANT } from '../../EmployeeScreen/constants/ManageEmployeeConstant';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import { SCREENS } from '../../../constants/MainConstant';
import { CHECK_IN_LABEL, CHECK_OUT_LABEL } from '../../DashboardScreen/constants/DashboardConstant';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';
import { getAsyncItem, setAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { getTodayFormatted } from '../../../utils/DateUtils';

const { screenWidth } = ScreenDimensions

const cardWidth = screenWidth * 0.95;

const MarkAttendanceEmployeeCard = ({ employee }) => {
  const [isCheckIn, setIsCheckIn] = useState(true);
  const navigation = useNavigation()
  const {t} = useTranslation()
  const[attendanceImageUri, setAttendanceImageUri] = useState()

  useEffect(() => {
    const loadCheckStatus = async () => {
      if (!employee?.userId) return;
      
      const checkInKey = `${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${employee?.userId}`;
      const dateKey = `${ASYNC_CONSTANT.MANAGE_CHECK_DATE}_${employee?.userId}`;

      const storedCheckIn = await getAsyncItem(checkInKey);
      const storedDate = await getAsyncItem(dateKey);

      const today = getTodayFormatted();

      if (storedDate !== today) {
        // Reset for a new date
        await setAsyncItem(checkInKey, 'true');
        await setAsyncItem(dateKey, today);
        setIsCheckIn(true);
      } else {
        setIsCheckIn(storedCheckIn === 'true');
      }
    };
    loadCheckStatus();
  }, [employee]);


  useEffect(() => {
    if (employee?.profilePicName) {
      setAttendanceImageUri(`${BaseConfigUrl.BASE_IMAGE_URL}${employee.profilePicName}`);
    }

  },[employee])

  const handleCheckPress = () => {
    navigation.navigate(SCREENS.SET_EMPLOYEE_ATTENDANCE, {
      isCheckIn,
      employee,
      onSuccess: async () => {
        const newState = !isCheckIn;
        setIsCheckIn(newState);
        const today = getTodayFormatted();
        await setAsyncItem(`${ASYNC_CONSTANT.MANAGE_CHECK_IN}_${employee.userId}`, newState.toString());
        await setAsyncItem(`${ASYNC_CONSTANT.MANAGE_CHECK_DATE}_${employee.userId}`, today);
    }
    });
  };

  // console.log('====MarkAttendanceEmployeeCard======employee=>>>>>>>',employee);
  // console.log('====MarkAttendanceEmployeeCard======attendanceImageUri=>>>>>>>',attendanceImageUri);
  

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{employee?.name}</Text>
        {attendanceImageUri ? (
          <Image source={{uri: attendanceImageUri}} style={styles.roundImage}/>
        ) : (
          <Image source={MyImages.profile} style={styles.profileIcon}/>
        )}
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.MOBILE)}</Text>
        <Text style={styles.dataText}>{employee?.mobile}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.ROLES)}</Text>
        <Text style={styles.dataText}>{employee?.roleName}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.JOINING_DATE)}</Text>
        <Text style={styles.dataText}>{employee?.doj}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.headerText}>{t(MANAGE_EMPLOYEE_CONSTANT.ADDRESS)}</Text>
        <Text style={styles.dataText}>{employee?.address}</Text>
      </View>
      <TouchableOpacity style={styles.setLocationButton} onPress={handleCheckPress}>
        <Text style={styles.setLocationText}>{isCheckIn ? t(CHECK_IN_LABEL) : t(CHECK_OUT_LABEL)}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MarkAttendanceEmployeeCard;

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
  profileIcon: {
    height: 50,
    width: 50,
  },
  headerText: {
    fontSize: 16,
    color: Colors.grey,
    fontWeight: '700',
    width: '35%',
  },
  dataText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '700',
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
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.red,
  }
});
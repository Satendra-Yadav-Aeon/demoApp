import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Colors from '../../../assets/colors/colors';
import { ATTENDANCE_CONSTANT } from '../constants/AttendanceConstant';
import { SCREENS } from '../../../constants/MainConstant';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';

const AdminAttendanceCard = ({ employee, selectedDates }) => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const[checkInPhotoUri, setCheckInPhotoUri] = useState();
  const[checkOutPhotoUri, setCheckOutPhotoUri] = useState();
  
  useEffect(() => {
    if (employee?.checkinPhoto) {
      setCheckInPhotoUri(`${BaseConfigUrl.BASE_ATTENDANCE_IMAGE_URL}${employee.empId}/${employee.checkinPhoto}`);
    }
    if (employee?.checkoutPhoto) {
      setCheckOutPhotoUri(`${BaseConfigUrl.BASE_ATTENDANCE_IMAGE_URL}${employee.empId}/${employee.checkoutPhoto}`);
    }

  },[employee])
    //Format status
  const getStatusText = (status) => {
    if (status === "1") return t(ATTENDANCE_CONSTANT.PRESENT);
    if (status === "0" || status === "2") return t(ATTENDANCE_CONSTANT.ABSENT);
    return ATTENDANCE_CONSTANT.NO_DATA;
  };

  //Format time as HH:mm
  const formatTime = (timeString) => {
    return timeString ? moment(timeString, 'HH:mm:ss.SSSSSSS').format('HH:mm') : ATTENDANCE_CONSTANT.NO_DATA;
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.NAME)}</Text>
          <Text style={styles.dataText}>{employee?.name || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.ROLE)}</Text>
          <Text style={styles.dataText}>{employee?.rolename || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.STATUS)}</Text>
          <Text style={styles.dataText}>{getStatusText(employee?.status)}</Text>
        </View>
        
      </View> 

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.DATE)}</Text>
          <Text style={styles.dataText}>{selectedDates || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.CHECK_IN)}</Text>
          <Text style={styles.dataText}>{formatTime(employee?.checkinTime)}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.CHECK_OUT)}</Text>
          <Text style={styles.dataText}>{formatTime(employee?.checkoutTime)}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.TOTAL_HOUR)}</Text>
          <Text style={styles.dataText}>{employee?.totalHrs || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.CHECK_IN)}</Text>
          {checkInPhotoUri ? (
            <Image source={{uri: checkInPhotoUri}} style={styles.roundImage}/>
          ) : (
            <Text style={styles.dataText}>{ATTENDANCE_CONSTANT.NO_DATA}</Text>
          )}
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{t(ATTENDANCE_CONSTANT.CHECK_OUT)}</Text>
          {checkOutPhotoUri ? (
            <Image source={{uri: checkOutPhotoUri}} style={styles.roundImage}/>
          ) : (
            <Text style={styles.dataText}>{ATTENDANCE_CONSTANT.NO_DATA}</Text>
          )}
        </View>
      </View>
       {/* ✅ Show for all employees, pass all 4 lat/long */}
      {employee?.checkinLat && employee?.checkinLong && (
        <TouchableOpacity
        style={[styles.flex1, styles.setLocationButton]}
        onPress={() =>
          navigation.navigate(SCREENS.GEOFENCE_MAP, {
            employeeId: employee?.empId,
            name: employee?.name,
            checkinLat: employee?.checkinLat,
            checkinLong: employee?.checkinLong,
            checkoutLat: employee?.checkoutLat,
            checkoutLong: employee?.checkoutLong,
          })
        }
      >
        <Text style={styles.setLocationText}>{t(ATTENDANCE_CONSTANT.CHECK_LOCATION)}</Text>
      </TouchableOpacity>
      )} 
    </View>
  )
};

export default AdminAttendanceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    margin: 10,
    padding: 15,
    borderRadius: 16,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    flex:1,
    marginLeft: 15,
    marginBottom: 10
  },
  flex1: {
    flex: 1,
    paddingHorizontal: 5,
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.grey,
    marginBottom: 4,
  },
  dataText: {
    fontSize: 17  ,
    fontWeight: 'bold',
    color: Colors.black,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: Colors.grey,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  setLocationButton: {
    backgroundColor: Colors.red,
    margin: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  setLocationText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  profileIcon: {
    height: 50,
    width: 50,
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.red,
  }
});
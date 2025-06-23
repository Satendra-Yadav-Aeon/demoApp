import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../assets/colors/colors';
import { ATTENDANCE_CONSTANT } from '../constants/AttendanceConstant';
import { SCREENS } from '../../../constants/MainConstant';


const AdminAttendanceCard = ({ employee, selectedDate }) => {
  const navigation = useNavigation()
  const attendanceRecord = employee?.attendance?.find(a => a.date === selectedDate);
  
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.NAME}</Text>
          <Text style={styles.dataText}>{employee?.name || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.ROLE}</Text>
          <Text style={styles.dataText}>{employee?.role || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.STATUS}</Text>
          <Text style={styles.dataText}>{attendanceRecord?.status || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        
      </View>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.DATE}</Text>
          <Text style={styles.dataText}>{selectedDate || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.CHECK_IN}</Text>
          <Text style={styles.dataText}>{attendanceRecord?.checkIn || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.CHECK_OUT}</Text>
          <Text style={styles.dataText}>{attendanceRecord?.checkOut || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.TOTAL_HOUR}</Text>
          <Text style={styles.dataText}>{attendanceRecord?.totalHrs || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.headerText}>{ATTENDANCE_CONSTANT.LOCATION}</Text>
          <Text style={styles.dataText}>{attendanceRecord?.location || ATTENDANCE_CONSTANT.NO_DATA}</Text>
        </View>
        <View style={styles.flex1}/>
      </View>
      {employee?.role === ATTENDANCE_CONSTANT.SUPERVISOR_ROLE && (
          <TouchableOpacity 
            style={[styles.flex1, styles.setLocationButton]}
            onPress={() =>
              navigation.navigate(SCREENS.GEOFENCE_MAP, {
                employeeId: employee?.id,
                name: employee?.name,
              })
          }
        >
          <Text style={styles.setLocationText}>{ATTENDANCE_CONSTANT.SET_LOCATION}</Text>
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
  }
});
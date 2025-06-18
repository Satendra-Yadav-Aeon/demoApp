import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAttendance } from '../context/EmployeeAttendanceContext';
import Colors from '../../../assets/colors/colors';
import RenderEmployeeAttendanceData from './RenderEmployeeAttendanceData';


const DayAttendance = () => {
  const { dayData } = useAttendance();
  
  return (
    <View style={styles.container}>
      <RenderEmployeeAttendanceData data={dayData}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
});

export default DayAttendance;
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../../assets/colors/colors';
import { useAttendance } from '../context/EmployeeAttendanceContext';
import RenderEmployeeAttendanceData from './RenderEmployeeAttendanceData';


const MonthAttendance = () => {
  const { monthData } = useAttendance();
  
  return (
    <View style={styles.container}>
      <RenderEmployeeAttendanceData data={monthData}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
});

export default MonthAttendance;
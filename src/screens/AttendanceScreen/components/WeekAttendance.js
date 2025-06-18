import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../../assets/colors/colors';
import { useAttendance } from '../context/EmployeeAttendanceContext';
import RenderEmployeeAttendanceData from './RenderEmployeeAttendanceData';


const WeekAttendance = () => {
  const { weekData } = useAttendance();
  
  return (
    <View style={styles.container}>
      <RenderEmployeeAttendanceData data={weekData}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
});

export default WeekAttendance;
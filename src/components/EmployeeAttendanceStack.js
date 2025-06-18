import React from 'react';
import { AttendanceProvider } from '../screens/AttendanceScreen/context/EmployeeAttendanceContext';
import EmployeeAttendance from '../screens/AttendanceScreen/components/EmployeeAttendance';


const EmployeeAttendanceStack = () => (
  <AttendanceProvider>
    <EmployeeAttendance/>
  </AttendanceProvider>
);

export default EmployeeAttendanceStack;
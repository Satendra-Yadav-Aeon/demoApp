import React, { createContext, useContext, useEffect, useState } from 'react';
import { EmployeeAttendanceData } from '../constants/EmployeeAttendanceData';
import useEmployeeAttendanceAPI from '../hooks/useEmployeeAttendanceAPI';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { useFocusEffect } from '@react-navigation/native';


const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const today = new Date();
  const[employeeData, setEmployeeData] = useState({})
  const {employeeAttendanceData, refetchEmployeeAttendance} = useEmployeeAttendanceAPI();

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  console.log('===AttendanceProvider==>>>employeeData>>',employeeData);
  


   useFocusEffect(
    React.useCallback(() => {
      if (employeeData?.empid) {
        refetchEmployeeAttendance({userId: employeeData?.empid});
      }
    }, [employeeData])
  );

  console.log('===AttendanceProvider==>>>employeeAttendanceData>>',employeeAttendanceData);

  const getDaysDiff = (inputDateStr) => {
    const inputDate = new Date(inputDateStr);
    const timeDiff = today.getTime() - inputDate.getTime();
    return timeDiff / (1000 * 3600 * 24);
  };

  const getFilteredData = () => {
    const todayStr = today.toISOString().split('T')[0];

    const dayData = EmployeeAttendanceData?.filter((item) => item.date === todayStr);

    const weekData = EmployeeAttendanceData?.filter((item) => {
      const diff = getDaysDiff(item.date);
      return diff <= 7;
    });

    const monthData = EmployeeAttendanceData?.filter((item) => {
      const diff = getDaysDiff(item.date);
      return diff <= 30;
    });

    return { dayData, weekData, monthData };
  };

  // Initial filtered data
  const { dayData, weekData, monthData } = getFilteredData();

  const [dayState, setDayState] = useState(dayData);
  const [weekState, setWeekState] = useState(weekData);
  const [monthState, setMonthState] = useState(monthData);

  // Refresh function
  const refreshData = () => {
    const { dayData, weekData, monthData } = getFilteredData();
    setDayState(dayData);
    setWeekState(weekData);
    setMonthState(monthData);
  };

  return (
    <AttendanceContext.Provider
      value={{
        dayData: dayState,
        weekData: weekState,
        monthData: monthState,
        refreshData,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

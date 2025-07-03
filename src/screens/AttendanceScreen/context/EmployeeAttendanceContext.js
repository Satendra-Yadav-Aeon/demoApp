import React, { createContext, useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import useEmployeeAttendanceAPI from '../hooks/useEmployeeAttendanceAPI';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
// import { EmployeeAttendanceData } from '../constants/EmployeeAttendanceData';

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState({});
  const [dayState, setDayState] = useState([]);
  const [weekState, setWeekState] = useState([]);
  const [monthState, setMonthState] = useState([]);

  const { employeeAttendanceData, refetchEmployeeAttendance } = useEmployeeAttendanceAPI();

  // Fetch logged-in employee data from AsyncStorage
  useEffect(() => {
    const fetchAsyncData = async () => {
      const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      setEmployeeData(data);
    };
    fetchAsyncData();
  }, []);

  // Refetch on screen focus
  useFocusEffect(
    React.useCallback(() => {
      if (employeeData?.empid) {
        refetchEmployeeAttendance({ userId: employeeData?.empid });
      }
    }, [employeeData?.empid])
  );

  const getDaysDiff = (inputDateStr) => {
    const inputDate = new Date(inputDateStr);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = today.getTime() - inputDate.getTime();
    return diff / (1000 * 3600 * 24);
  };

  const filterData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const dayData = employeeAttendanceData?.filter(item => item.date === todayStr) || [];

    const weekData = employeeAttendanceData?.filter(item => {
      const diff = getDaysDiff(item.date);
      return diff >= 0 && diff <= 6;
    }) || [];

    const monthData = employeeAttendanceData?.filter(item => {
      const diff = getDaysDiff(item.date);
      return diff >= 0 && diff <= 29;
    }) || [];

    setDayState(dayData);
    setWeekState(weekData);
    setMonthState(monthData);
  };

  // Refactor data every time API data updates
  useEffect(() => {
    if (employeeAttendanceData && employeeAttendanceData.length) {
      filterData();
    }
  }, [employeeAttendanceData]);

  const refreshData = () => {
    filterData();
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

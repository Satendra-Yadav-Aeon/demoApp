import React, { createContext, useContext, useState } from 'react';
import { EmployeeAttendanceData } from '../constants/EmployeeAttendanceData';


const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const today = new Date();

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

export const useAttendance = () => useContext(AttendanceContext);
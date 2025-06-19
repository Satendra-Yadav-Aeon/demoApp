import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { AdminAttendanceData } from '../constants/AdminAttendanceData';
import { DATE_FORMAT_A } from '../../../constants/MainConstant';
import { ATTENDANCE_STATUS } from '../constants/AttendanceConstant';

const AdminAttendanceContext = createContext();

export const AdminAttendanceProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(moment().format(DATE_FORMAT_A));
  const [totalEmployees, setTotalEmployees] = useState([]);
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState([]);

  useEffect(() => {
    filterDataByDate(selectedDate);
  }, [selectedDate]);

  const filterDataByDate = (date) => {
    const total = AdminAttendanceData;

    const present = total?.filter(emp =>
      emp.attendance.find(att => att.date === date && att.status === ATTENDANCE_STATUS.PRESENT)
    );

    const absent = total?.filter(emp => 
      emp.attendance.find(att => att.date === date && att.status === ATTENDANCE_STATUS.ABSENT)
    );

    setTotalEmployees(total);
    setPresentEmployees(present);
    setAbsentEmployees(absent);
  };

  return (
    <AdminAttendanceContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        totalEmployees,
        presentEmployees,
        absentEmployees,
      }}
    >
      {children}
    </AdminAttendanceContext.Provider>
  );
};

export const useAdminAttendance = () => {
  const context = useContext(AdminAttendanceContext);
  if (!context) {
    throw new Error('useAdminAttendance must be used within an AdminAttendanceProvider');
  }
  return context;
};
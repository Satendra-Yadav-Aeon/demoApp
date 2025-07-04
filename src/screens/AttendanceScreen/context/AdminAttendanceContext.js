import React, { createContext, useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import { DATE_FORMAT_A } from '../../../constants/MainConstant';
import useAdminAttendanceAPI from '../hooks/useAdminAttendanceAPI';
import { getAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';

const AdminAttendanceContext = createContext();

export const AdminAttendanceProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState(moment().format(DATE_FORMAT_A));
  const [totalEmployees, setTotalEmployees] = useState([]);
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [absentEmployees, setAbsentEmployees] = useState([]);
  const[employeeData, setEmployeeData] = useState({})

  const {adminAttendanceData, refetchAdminAttendance} = useAdminAttendanceAPI()

  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setEmployeeData(data)
  }

  useFocusEffect(
    React.useCallback(() => {
      if (employeeData?.empid && selectedDates) {
        refetchAdminAttendance({AdminId: employeeData?.empid, Dateval: selectedDates});
      }
    }, [employeeData, selectedDates])
  );

  useEffect(() => {
    filterDataByDate(selectedDates);
  }, [selectedDates,adminAttendanceData]);

  const filterDataByDate = (date) => {
    const total = adminAttendanceData || [];

    // Filter by selectedDate if available (if dateval is being set)
    const filteredByDate = total.filter(emp => {
      const photoDate = emp?.checkinPhoto?.split('_')[1]; // "2025-07-03"
      return photoDate === date;
    });

    const present = filteredByDate.filter(emp => emp.status === "1");
    const absent = filteredByDate.filter(emp => emp.status !== "1");

    setTotalEmployees(filteredByDate);
    setPresentEmployees(present);
    setAbsentEmployees(absent);
  };




  // console.log('====AdminAttendanceContext==>>selectedDate>>>>', selectedDates);
  // console.log('====AdminAttendanceContext==>>employeeData>>>>', employeeData);
  // console.log('====AdminAttendanceContext==>>adminAttendanceData>>>>', adminAttendanceData);
  

  return (
    <AdminAttendanceContext.Provider
      value={{
        selectedDates,
        setSelectedDates,
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
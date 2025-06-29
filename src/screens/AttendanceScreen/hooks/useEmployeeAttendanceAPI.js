import { useEffect, useState } from 'react';
import { getEmployeeAttendanceData } from '../api/attendanceService';

const useEmployeeAttendanceAPI = () => {
  const [employeeAttendanceData, setEmployeeAttendanceData] = useState([]); 

  useEffect(() => {
    fetchEmployeeAttendance();
  }, []);

  const fetchEmployeeAttendance = async () => {
    try {
      const res = await getEmployeeAttendanceData();
      setEmployeeAttendanceData(res);
    } catch (err) {
    //   console.error('===fetchEmployeeAttendance==error>>>>', err);
    }
  };
  
  return { employeeAttendanceData };
};

export default useEmployeeAttendanceAPI;

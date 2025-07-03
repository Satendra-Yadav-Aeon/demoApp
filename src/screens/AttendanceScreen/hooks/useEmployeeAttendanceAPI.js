import { useState, useCallback } from 'react';
import { getEmployeeAttendanceData } from '../api/attendanceService';

const useEmployeeAttendanceAPI = () => {
  const [employeeAttendanceData, setEmployeeAttendanceData] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeAttendance = useCallback(async (payload) => {
    console.log('===fetchSupervisorsEmployeeData==>>payload>>>',payload);
    
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getEmployeeAttendanceData(payload);
      setEmployeeAttendanceData(res);
    } catch (err) {
      // console.error('Error fetching employee details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { employeeAttendanceData, isLoading, refetchEmployeeAttendance: fetchEmployeeAttendance };
};

export default useEmployeeAttendanceAPI;

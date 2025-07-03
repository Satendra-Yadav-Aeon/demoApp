import { useState, useCallback } from 'react';
import { getEmployeeTodayAttendance } from '../api/dashboardService';

const useGetEmployeeTodayAttendance = () => {
  const [empAttendance, setEmpAttendance] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeTodayAttendance = useCallback(async (payload) => {
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getEmployeeTodayAttendance(payload);
      setEmpAttendance(res);
    } catch (err) {
      // console.error('Error fetching employee details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { empAttendance, isLoading, refetchAttendance: fetchEmployeeTodayAttendance };
};

export default useGetEmployeeTodayAttendance;

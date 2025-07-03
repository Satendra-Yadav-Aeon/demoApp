import { useState, useCallback } from 'react';
import { getSupervisorsEmployeeData } from '../api/attendanceService';

const useGetSupervisorsEmployeeAPI = () => {
  const [supervisorsEmployeeList, setSupervisorsEmployeeList] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchSupervisorsEmployeeData = useCallback(async (payload) => {
    console.log('===fetchSupervisorsEmployeeData==>>payload>>>',payload);
    
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getSupervisorsEmployeeData(payload);
      setSupervisorsEmployeeList(res);
    } catch (err) {
      // console.error('Error fetching employee details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { supervisorsEmployeeList, isLoading, refetchSupervisorEmployeeList: fetchSupervisorsEmployeeData };
};

export default useGetSupervisorsEmployeeAPI;

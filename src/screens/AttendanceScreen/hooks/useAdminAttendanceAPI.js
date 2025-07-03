import { useState, useCallback } from 'react';
import { getAdminAttendanceData } from '../api/attendanceService';

const useAdminAttendanceAPI = () => {
  const [adminAttendanceData, setAdminAttendanceData] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminAttendance = useCallback(async (payload) => {
    console.log('===fetchAdminAttendance==>>payload>>>',payload);
    
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getAdminAttendanceData(payload);
      setAdminAttendanceData(res);
    } catch (err) {
      // console.error('===fetchAdminAttendance=====error=>>>>>', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { adminAttendanceData, isLoading, refetchAdminAttendance: fetchAdminAttendance };
};

export default useAdminAttendanceAPI;

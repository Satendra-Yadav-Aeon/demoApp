import { useState, useCallback } from 'react';
import { getAdminAttendanceCount } from '../api/attendanceService';

const useAdminAttendanceCountAPI = () => {
  const [adminAttendanceCount, setAdminAttendanceCount] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminAttendanceCount = useCallback(async (payload) => {
    console.log('===fetchAdminAttendanceCount==>>payload>>>',payload);
    
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getAdminAttendanceCount(payload);
      setAdminAttendanceCount(res);
    } catch (err) {
      // console.error('===fetchAdminAttendanceCount==>>error>>>', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { adminAttendanceCount, isLoading, refetchAdminAttendanceCount: fetchAdminAttendanceCount };
};

export default useAdminAttendanceCountAPI;

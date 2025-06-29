import { useEffect, useState } from 'react';
import { getAdminAttendanceData } from '../api/attendanceService';

const useAdminAttendanceAPI = () => {
  const [adminAttendanceData, setAdminAttendanceData] = useState([]); 

  useEffect(() => {
    fetchAdminAttendance();
  }, []);

  const fetchAdminAttendance = async () => {
    try {
      const res = await getAdminAttendanceData();
      setAdminAttendanceData(res);
    } catch (err) {
    //   console.error('===fetchAdminAttendance==error>>>>', err);
    }
  };
  
  return { adminAttendanceData };
};

export default useAdminAttendanceAPI;

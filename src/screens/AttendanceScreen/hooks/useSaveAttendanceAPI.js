import { useState } from 'react';
import { saveEmployeeAttendance } from '../api/attendanceService';

const useSaveAttendanceAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveAttendanceData, setSaveAttendanceData] = useState(null);

  const saveAttendance = async (payload) => {
    setIsLoading(true);
    try {
      const data = await saveEmployeeAttendance(payload);
      setSaveAttendanceData(data);
      return data;
    } catch (err) {
      // console.log('===saveAttendance====>error>>>>>',err);
    } finally {
      setIsLoading(false);
    }
  };

  return { saveAttendance, isLoading, saveAttendanceData };
};

export default useSaveAttendanceAPI;
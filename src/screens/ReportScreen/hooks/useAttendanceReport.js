import { useState } from 'react';
import { getAttendanceReport } from '../api/reportService';

export const useAttendanceReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); 

  const fetchAttendanceReport = async (payload) => {
    // console.log('===useAttendanceReport==>>fetchAttendanceReport>>payload>',payload);
    
    setIsLoading(true);
    try {
      const response = await getAttendanceReport(payload);
      if(response){
        setAttendanceData(response);
      }
    } catch (err) {
       //   console.error('===fetchAttendanceReport==error>>>>', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchAttendanceReport, attendanceData, isLoading };
};
import { useEffect, useState } from 'react';
import { getEmployeeSupervisorAttendanceData } from '../api/attendanceService';

const useEmployeeSupervisorAttendanceAPI = () => {
  const [employeeSupervisorAttendanceData, setEmployeeSupervisorAttendanceData] = useState([]); 

  useEffect(() => {
    fetchEmployeeSupervisorAttendance();
  }, []);

  const fetchEmployeeSupervisorAttendance = async () => {
    try {
      const res = await getEmployeeSupervisorAttendanceData();
      setEmployeeSupervisorAttendanceData(res);
    } catch (err) {
    //   console.error('===fetchEmployeeSupervisorAttendance==error>>>>', err);
    }
  };
  
  return { employeeSupervisorAttendanceData };
};

export default useEmployeeSupervisorAttendanceAPI;

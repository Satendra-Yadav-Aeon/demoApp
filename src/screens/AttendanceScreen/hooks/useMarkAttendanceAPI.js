import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { TOAST_MESSAGE } from '../../../constants/MainConstant';
import { markAttendanceData } from '../api/attendanceService';
import { SET_EMPLOYEE_ATTENDANCE } from '../constants/AttendanceConstant';

export const useMarkAttendanceAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const markAttendance = async (payload) => {
    console.log('===useMarkAttendanceAPI==>>markAttendance>>payload>',payload);
    
    setIsLoading(true);
    try {
      const response = await markAttendanceData(payload);
      if(response){
        Toast.show({
            type: TOAST_MESSAGE.SUCCESS,
            text1: payload?.inOut === 1
            ? SET_EMPLOYEE_ATTENDANCE.CHECK_IN_SUCCESS
            : SET_EMPLOYEE_ATTENDANCE.CHECK_OUT_SUCCESS,
        });
        return true;
      }
      return response;
    } catch (err) {
        Toast.show({
        type: TOAST_MESSAGE.ERROR,
        text1: TOAST_MESSAGE.ERROR_MSG,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { markAttendance, isLoading };
};
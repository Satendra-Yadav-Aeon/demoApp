import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { saveEmployeeData } from '../api/employeeService';
import { TOAST_MESSAGE } from '../../../constants/MainConstant';

export const useSaveEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);

  const saveEmployee = async (payload) => {
    setIsLoading(true);
    try {
      const response = await saveEmployeeData(payload);
      if(response){
        Toast.show({
          type: TOAST_MESSAGE.SUCCESS,
          text1: TOAST_MESSAGE.SUCCESS_TEXT,
          text2: TOAST_MESSAGE.SUCCESS_MSG,
        });
      }
      return response;
    } catch (err) {
        Toast.show({
        type: TOAST_MESSAGE.ERROR,
        text1: TOAST_MESSAGE.ERROR_TEXT,
        text2: TOAST_MESSAGE.ERROR_MSG,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { saveEmployee, isLoading };
};
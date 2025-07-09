import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { TOAST_MESSAGE } from '../../../constants/MainConstant';
import { saveTaskData } from '../api/taskService';

export const useSaveTaskAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  const saveTask = async (payload) => {
    setIsLoading(true);
    try {
      const response = await saveTaskData(payload);
      if(response){
        Toast.show({
          type: TOAST_MESSAGE.SUCCESS,
          text1: t(TOAST_MESSAGE.SUCCESS_TEXT),
          text2: t(TOAST_MESSAGE.SUCCESS_MSG),
        });
        return true;
      }
      return response;
    } catch (err) {
        Toast.show({
        type: TOAST_MESSAGE.ERROR,
        text1: t(TOAST_MESSAGE.ERROR_TEXT),
        text2: t(TOAST_MESSAGE.ERROR_MSG),
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { saveTask, isLoading };
};
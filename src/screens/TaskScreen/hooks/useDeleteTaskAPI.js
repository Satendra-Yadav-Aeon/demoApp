import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { TOAST_MESSAGE } from '../../../constants/MainConstant';
import { deleteTaskData } from '../api/taskService';

export const useDeleteTaskAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  const deleteTask = async (payload) => {
    setIsLoading(true);
    try {
      const response = await deleteTaskData(payload);
      if(response){
        Toast.show({
          type: TOAST_MESSAGE.SUCCESS,
          text1: t(TOAST_MESSAGE.SUCCESS_TEXT),
          text2: t(TOAST_MESSAGE.DELETE_MSG),
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

  return { deleteTask, isLoading };
};
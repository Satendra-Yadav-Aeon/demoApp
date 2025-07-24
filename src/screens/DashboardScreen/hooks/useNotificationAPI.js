import { useState, useCallback } from 'react';
import { getAdminNotificationData } from '../api/dashboardService';

const useNotificationAPI = () => {
  const [notificationData, setNotificationData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotificationData = useCallback(async (payload) => {
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getAdminNotificationData(payload);
      setNotificationData(res);
    } catch (err) {
    //   console.error('==fetchNotificationData====>error>>>>>>', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { notificationData, isLoading, refetchNotification: fetchNotificationData };
};

export default useNotificationAPI;

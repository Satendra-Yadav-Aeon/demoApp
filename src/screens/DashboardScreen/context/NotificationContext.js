import React, { createContext, useEffect, useState } from 'react';
import useNotificationAPI from '../hooks/useNotificationAPI';
import { getAsyncItem, setAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [notificationList, setNotificationList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readIds, setReadIds] = useState([]);

  const { notificationData, refetchNotification } = useNotificationAPI();

  // Fetch employee login data
  useEffect(() => {
    const fetchEmp = async () => {
      const emp = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      const storedReadIds = await getAsyncItem(ASYNC_CONSTANT.READ_NOTIFICATIONS);
      setEmployeeData(emp);
      setReadIds(storedReadIds || []);
    };
    fetchEmp();
  }, []);

  // Fetch notifications after empid is available
  useEffect(() => {
    if (employeeData?.empid) {
      refetchNotification({ adminId: employeeData.empid });
    }
  }, [employeeData]);

  // Sync data from hook
  useEffect(() => {
    if (notificationData) {
      const mergedList = notificationData?.map((item) => {
        const id = `${item.empid}_${item.checkdate}`;
        return {
          ...item,
          isRead: readIds.includes(id),
        };
      });
      setNotificationList(mergedList);
      setUnreadCount(mergedList.filter((item) => !item.isRead).length);
    }
  }, [notificationData, readIds]);

  const markAsRead = async (id) => {
    const updatedReadIds = [...new Set([...readIds, id])];
    await setAsyncItem(ASYNC_CONSTANT.READ_NOTIFICATIONS, updatedReadIds);
    setReadIds(updatedReadIds);
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const allIds = notificationList?.map((item) => `${item.empid}_${item.checkdate}`);
    await setAsyncItem(ASYNC_CONSTANT.READ_NOTIFICATIONS, allIds);
    setReadIds(allIds);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificationList,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refetchNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

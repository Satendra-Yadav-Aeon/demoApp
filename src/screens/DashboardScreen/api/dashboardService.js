import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getEmployeeDetailsById = async (payload) => {
  const { empid } = payload;

  const data = { empid };

  console.log('====getEmployeeDetailsById=>>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_EMPLOYEE_DETAILS_BY_ID, data);
  console.log('==getEmployeeDetailsById==>response>>>>',response);
  return response.data;
};

export const getEmployeeTodayAttendance = async (payload) => {
  const { userId } = payload;

  const data = { userId };

  // console.log('====getEmployeeTodayAttendance=>>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_EMPLOYEE_TODAY_ATTENDANCE, data);
  // console.log('==getEmployeeTodayAttendance==>response>>>>',response);
  return response.data;
};

export const getAdminNotificationData = async (payload) => {
  const { adminId } = payload;

  const data = { adminId };

  // console.log('====getAdminNotificationData=>>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_ADMIN_NOTIFICATION_DATA, data);
  // console.log('==getAdminNotificationData==>response>>>>',response);
  return response.data;
};
import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getAdminAttendanceData = async () => {
  const response = await axiosInstance.get(Endpoints.GET_ADMIN_ATTENDANCE);
  // console.log('==getAllEmployeeList==>response>>>>',response);
  return response.data;
};

export const getEmployeeAttendanceData = async () => {
  const response = await axiosInstance.get(Endpoints.GET_EMPLOYEE_ATTENDANCE);
  // console.log('==getAllEmployeeList==>response>>>>',response);
  return response.data;
};
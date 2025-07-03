import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getAdminAttendanceData = async () => {
  const response = await axiosInstance.get(Endpoints.GET_ADMIN_ATTENDANCE);
  // console.log('==getAdminAttendanceData==>response>>>>',response);
  return response.data;
};

export const getEmployeeAttendanceData = async () => {
  const response = await axiosInstance.get(Endpoints.GET_EMPLOYEE_ATTENDANCE);
  // console.log('==getEmployeeAttendanceData==>response>>>>',response);
  return response.data;
};

export const getEmployeeSupervisorAttendanceData = async () => {
  const response = await axiosInstance.get(Endpoints.GET_EMPLOYEE_SUPERVISOR_ATTENDANCE);
  // console.log('==getEmployeeSupervisorAttendanceData==>response>>>>',response);
  return response.data;
};

export const saveEmployeeAttendance = async (payload) => {
  const { empname, role, checkDate, checkLat, checkLong, checkPhoto, attendanceBy } = payload;

  const data = {
    empname: empname,
    role: role,
    checkDate: checkDate,
    checkLat: checkLat,
    checkLong: checkLong,
    checkPhoto: checkPhoto,
    attendanceBy: attendanceBy,
  };

  const response = await axiosInstance.post(Endpoints.SAVE_ATTENDANCE, data);
  // console.log('==saveAttendance===response==>>>>',response);
  return response.data;
};

export const getSupervisorsEmployeeData = async (payload) => {
  const { userid } = payload;

  const data = {userid};

  const response = await axiosInstance.post(Endpoints.GET_SUPERVISORS_EMPLOYEE_LIST, data);
  // console.log('==saveAttendance===response==>>>>',response);
  return response.data;
};
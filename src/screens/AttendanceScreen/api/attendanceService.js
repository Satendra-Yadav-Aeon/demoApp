import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getAdminAttendanceData = async (payload) => {
  const {selectedDate, userId} = payload;
  const data = {
    selectedDate: selectedDate,
    userId: userId
  }
  console.log('====getAdminAttendanceData===>>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_ADMIN_ATTENDANCE);
  console.log('==getAdminAttendanceData==>response>>>>',response);
  return response.data;
};

export const getEmployeeAttendanceData = async (payload) => {
  const {userId} = payload;
  const data = {userId}

  // console.log('===getEmployeeAttendanceData==>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_EMPLOYEE_ATTENDANCE, data);
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
  const { userId } = payload;

  const data = {userId};

  const response = await axiosInstance.post(Endpoints.GET_SUPERVISORS_EMPLOYEE_LIST, data);
  console.log('==saveAttendance===response==>>>>',response);
  return response.data;
};

export const markAttendanceData = async (payload) => {
  const { empId, status, checkDate, latitude, longitude ,imgfile, imageName, inOut, attendanceMode, attendenceBy} = payload;

  const formData = new FormData();

  formData.append('empId', empId);
  formData.append('status', status);
  formData.append('checkDate', checkDate);
  formData.append('latitude',latitude)
  formData.append('longitude', longitude);
  formData.append('inOut', inOut);
  formData.append('attendanceMode',attendanceMode)
  formData.append('attendenceBy',attendenceBy)

  if (imgfile) {
    const fileType = imgfile.substring(imgfile.lastIndexOf('.') + 1);
    
    formData.append('imgfile', {
      uri: imgfile,
      name: imageName,
      type: `image/${fileType}`, // e.g., image/jpeg or image/png
    });
  }

  console.log('===markAttendanceData==>>>formData>>',formData);
  
  const response = await axiosInstance.post(Endpoints.MARK_ATTENDANCE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('===markAttendanceData====>response>>>>>>', response);
  return response.data;
};

export const getAdminAttendanceCount = async (payload) => {
  const {selectedDate, userId} = payload;
  const data = {
    selectedDate: selectedDate,
    userId: userId
  }
  console.log('====getAdminAttendanceCount===>>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_ADMIN_ATTENDANCE_COUNT);
  console.log('==getAdminAttendanceCount==>response>>>>',response);
  return response.data;
};
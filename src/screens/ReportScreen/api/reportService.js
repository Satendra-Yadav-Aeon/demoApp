import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getAttendanceReport = async (payload) => {
  const { empid, fromdate, todate } = payload;

  const data = {
    empid: empid,
    fromdate: fromdate,
    todate: todate,
  };

  // console.log('====getAttendanceReport=======>data>>>>>>',data);
  

  const response = await axiosInstance.post(Endpoints.GET_ATTENDANCE_REPORT, data);
  // console.log('==getAttendanceReport==>response>>>>',response);
  return response.data;
};

export const getTaskReport = async (payload) => {
  const { empid, fromdate, todate } = payload;

  const data = {
    empid: empid,
    fromdate: fromdate,
    todate: todate,
  };

  // console.log('====getTaskReport=======>data>>>>>>',data);
  

  const response = await axiosInstance.post(Endpoints.GET_TASK_REPORT, data);
  // console.log('==getTaskReport==>response>>>>',response);
  return response.data;
};
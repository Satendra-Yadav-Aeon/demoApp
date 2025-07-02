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
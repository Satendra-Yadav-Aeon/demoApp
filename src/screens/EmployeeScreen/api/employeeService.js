import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getEmployeeRole = async () => {
  const response = await axiosInstance.get(Endpoints.EMPLOYEE_ROLE_API);
  // console.log('==getEmployeeRole==>response>>>>',response);
  return response.data;
};

export const getAdminRoleList = async () => {
  const response = await axiosInstance.get(Endpoints.ADMIN_LIST_ROLE_API);
  // console.log('==getAdminRoleList==>response>>>>',response);
  return response.data;
};

export const getSupervisorRoleList = async () => {
  const response = await axiosInstance.get(Endpoints.SUPERVISOR_LIST_ROLE_API);
  // console.log('==getSupervisorRoleList==>response>>>>',response);
  return response.data;
};

export const saveEmployeeData = async (payload) => {
  const { empname, mobile, role, joiningdate, leavingdate, address, repomanager } = payload;

  const data = {
    empname: empname,
    mobile: mobile,
    role: role,
    joiningdate: joiningdate,
    leavingdate: leavingdate,
    address: address,
    repomanager: repomanager,
  };

  const response = await axiosInstance.post(Endpoints.SAVE_EMPLOYEE, data);
  // console.log('==saveEmployeeData==>response>>>>',response);
  return response.data;
};
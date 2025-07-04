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

export const getSupervisorRoleList = async (payload) => {
  const {empid} = payload;
  const data = {empid}
  console.log('====getSupervisorRoleList===>>>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.SUPERVISOR_LIST_ROLE_API,data);
  console.log('==getSupervisorRoleList==>response>>>>',response);
  return response.data;
};

export const saveEmployeeData = async (payload) => {
  const { empid, empname, mobile, role, joiningdate, leavingdate, address, repomanager,photo,adminId } = payload;

  const data = {
    empid: empid,
    empname: empname,
    mobileno: mobile,
    role: role,
    joiningdate: joiningdate,
    leavingdate: leavingdate,
    address: address,
    repomanager: repomanager,
    photo: photo,
    admnId: adminId
  };

  console.log('====saveEmployeeData=======>data>>>>>>',data);
  

  const response = await axiosInstance.post(Endpoints.SAVE_EMPLOYEE, data);
  // console.log('==saveEmployeeData==>response>>>>',response);
  return response.data;
};

export const getAllEmployeeList = async (payload) => {
  const {admnId} = payload;
  const data = {admnId}
  // console.log('===getAllEmployeeList=>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_ALL_EMPLOYEE, data);
  // console.log('==getAllEmployeeList==>response>>>>',response);
  return response.data;
};
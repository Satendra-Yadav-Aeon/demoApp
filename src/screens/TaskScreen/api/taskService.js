import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";


export const saveTaskData = async (payload) => {
  const { taskId, taskName, empId, roleId, taskDesc, startDatetime, endDatetime, imgfile, taskStatus, taskMode, assignBy, imageName } = payload;

  const formData = new FormData();

  formData.append('taskId', taskId);
  formData.append('taskName', taskName);
  formData.append('empId', empId);
  formData.append('roleId',roleId)
  formData.append('taskDesc', taskDesc);
  formData.append('startDatetime', startDatetime);
  formData.append('endDatetime', endDatetime);
  formData.append('taskStatus',taskStatus)
  formData.append('taskMode', taskMode);
  formData.append('assignBy',assignBy);

  if (imgfile) {
    const fileType = imgfile.substring(imgfile.lastIndexOf('.') + 1);
    
    formData.append('imgfile', {
      uri: imgfile,
      name: imageName,
      type: `image/${fileType}`, // e.g., image/jpeg or image/png
    });
  }

  // console.log('===saveTaskData==>>>formData>>',formData);
  
  const response = await axiosInstance.post(Endpoints.SAVE_TASK, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // console.log('===saveTaskData====>response>>>>>>', response);
  return response.data;
};


export const getTaskDetailsByEmployeeId = async (payload) => {
  const {empId} = payload;
  const data = {empId}
  // console.log('===getTaskDetailsByEmployeeId=>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.GET_TASK_DETAILS, data);
  // console.log('==getTaskDetailsByEmployeeId==>response>>>>',response);
  return response.data;
};

export const deleteTaskData = async (payload) => {
  const {taskId, empId, taskStatus} = payload;
  const data = {taskId, empId, taskStatus}
  // console.log('===deleteTaskData=>data>>>',data);
  
  const response = await axiosInstance.post(Endpoints.DELETE_TASK, data);
  // console.log('==deleteTaskData==>response>>>>',response);
  return response.data;
};
import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";


export const saveProfileData = async (payload) => {
  const { empid, mobileno, address, photo, photoname } = payload;

  const formData = new FormData();

  formData.append('empid', empid);
  formData.append('mobileno', mobileno);
  formData.append('address', address);
  formData.append('photo',photo)
  formData.append('photoname',photoname)

  // console.log('===saveProfileData==>>>formData>>',formData);
  
  const response = await axiosInstance.post(Endpoints.SAVE_PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // console.log('===saveProfileData====>response>>>>>>', response);
  return response.data;
};
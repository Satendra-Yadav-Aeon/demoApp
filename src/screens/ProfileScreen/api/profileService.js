import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";


export const saveProfileData = async (payload) => {
  const { empid, mobileno, address, photo, photoname } = payload;

  const formData = new FormData();

  formData.append('empid', empid);
  formData.append('mobileno', mobileno);
  formData.append('address', address);
  formData.append('photoname',photoname)

  if (photo) {
    const fileType = photo.substring(photo.lastIndexOf('.') + 1);
    
    formData.append('photo', {
      uri: photo,
      name: photoname,
      type: `image/${fileType}`, // e.g., image/jpeg or image/png
    });
  }

  // console.log('===saveProfileData==>>>formData>>',formData);
  
  const response = await axiosInstance.post(Endpoints.SAVE_PROFILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // console.log('===saveProfileData====>response>>>>>>', response);
  return response.data;
};


export const updatePasswordData = async (payload) => {
  const {empid, currPwd, newPwd } = payload;
  const data = {empid, currPwd, newPwd}
  
  const response = await axiosInstance.post(Endpoints.CHANGE_PASSWORD,data);
  return response.data;
};
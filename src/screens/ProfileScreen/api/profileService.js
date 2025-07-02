import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";



export const saveProfileData = async (payload) => {
  const { empId, mobile, address, photo } = payload;

  const data = {
    empId: empId,
    mobileno: mobile,
    address: address,
    photo: photo
  };

  const response = await axiosInstance.post(Endpoints.SAVE_PROFILE, data);
  return response.data;
};
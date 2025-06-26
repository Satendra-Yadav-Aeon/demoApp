import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";


export const loginService = async (payload) => {
  const { mobileNumber, password } = payload;

  const data = {
    mobile: mobileNumber,
    password: password,
  };

  const response = await axiosInstance.post(Endpoints.LOGIN_API, data);
  return response.data;
};
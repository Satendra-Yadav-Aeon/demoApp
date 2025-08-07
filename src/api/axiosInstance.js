import axios from 'axios';
import { BaseConfigUrl } from '../env/BaseConfigUrl';
import { getAsyncItem } from '../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';

const axiosInstance = axios.create({
  baseURL: BaseConfigUrl.BASE_URL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    try {
      const loginDataStr = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      const token = loginDataStr?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // console.error('====axiosInstance====>failed to get token>>>>>>>>>>', err);
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // console.log('==axiosInstance===response>>>>>',response);
    return response;
  },
  error => {
    // console.log('==axiosInstance===error>>>>>',error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
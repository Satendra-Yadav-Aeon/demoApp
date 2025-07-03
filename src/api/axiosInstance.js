import axios from 'axios';
import { BaseConfigUrl } from '../env/BaseConfigUrl';

const axiosInstance = axios.create({
  baseURL: BaseConfigUrl.BASE_URL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(config => {
  const token = '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const fullUrl = `${config.baseURL}${config.url}`;
  // console.log('[REQUEST]', config.method?.toUpperCase(), fullUrl);
  return config;
}, error => {
    return Promise.reject(error);
  });

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log('==axiosInstance===response>>>>>',response);
    return response;
  },
  error => {
    console.log('==axiosInstance===error>>>>>',error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
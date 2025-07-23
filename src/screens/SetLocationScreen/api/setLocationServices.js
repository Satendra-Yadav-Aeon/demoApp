import axiosInstance from "../../../api/axiosInstance";
import { Endpoints } from "../../../services/Endpoints";

export const getGeofenceLocationDropdown = async () => {
  const response = await axiosInstance.get(Endpoints.GEOFENCE_DROPDOWN);
  // console.log('==getGeofenceLocationDropdown==>response>>>>',response);
  return response.data;
};

export const saveGeofenceData = async (payload) => {
  const data = payload

  // console.log('====saveGeofenceData=======>data>>>>>>',data);

  const response = await axiosInstance.post(Endpoints.SAVE_GEOFENCE, data);
  // console.log('==saveGeofenceData==>response>>>>',response);
  return response.data;
};
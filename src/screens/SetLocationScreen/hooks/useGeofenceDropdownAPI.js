import { useEffect, useState } from 'react';
import { getGeofenceLocationDropdown } from '../api/setLocationServices';

const useGeofenceDropdownAPI = () => {
  const [geofenceDropdown, setGeofenceDropdown] = useState([]); 

  useEffect(() => {
    fetchGeofenceDropdown();
  }, []);

  const fetchGeofenceDropdown = async () => {
    try {
      const dropdownRes = await getGeofenceLocationDropdown();
      setGeofenceDropdown(dropdownRes);
    } catch (err) {
      // console.error('===fetchGeofenceDropdown==error>>>>', err);
    }
  };
  
  return { geofenceDropdown };
};

export default useGeofenceDropdownAPI;
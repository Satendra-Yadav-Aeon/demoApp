import { useState, useCallback } from 'react';
import { getBackgroundLocationData } from '../api/dashboardService';

const useGetBackgroundLocation = () => {
  const [backgroundLocationData, setBackgroundLocationData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchBackgroundLocation = useCallback(async (payload) => {
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getBackgroundLocationData(payload);
      setBackgroundLocationData(res);
    } catch (err) {
      // console.error('Error fetching background location:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { backgroundLocationData, isLoading, refetchBackgroundLocation: fetchBackgroundLocation };
};

export default useGetBackgroundLocation;

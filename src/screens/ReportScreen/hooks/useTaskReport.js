import { useState } from 'react';
import { getTaskReport } from '../api/reportService';

export const useTaskReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState([]); 

  const fetchTaskReport = async (payload) => {
    // console.log('===useTaskReport==>>fetchTaskReport>>payload>',payload);
    
    setIsLoading(true);
    try {
      const response = await getTaskReport(payload);
      if(response){
        setTaskData(response);
      }
    } catch (err) {
       //   console.error('===fetchTaskReport==error>>>>', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchTaskReport, taskData, isLoading };
};
import { useCallback, useEffect, useState } from 'react';
import { getTaskDetailsByEmployeeId } from '../api/taskService';

const useGetTaskDetailsAPI = () => {
  const [taskData, setTaskData] = useState([]); 


  const fetchTaskDetails = useCallback(async (payload) => {
    if (!payload?.empId) return;
    try {
      const res = await getTaskDetailsByEmployeeId(payload);
      setTaskData(res);
    } catch (err) {
    //   console.error('===fetchTaskDetails==error>>>>', err);
    }
  },[]);
  
  return { taskData, refetchTaskDetails: fetchTaskDetails };
};

export default useGetTaskDetailsAPI;

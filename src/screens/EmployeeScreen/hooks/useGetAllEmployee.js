import { useCallback, useEffect, useState } from 'react';
import { getAllEmployeeList } from '../api/employeeService';

const useGetAllEmployee = () => {
  const [manageEmployeeData, setManageEmployeeData] = useState([]); 

  useEffect(() => {
    fetchAllEmployee();
  }, [fetchAllEmployee]);

  const fetchAllEmployee = useCallback(async () => {
    try {
      const res = await getAllEmployeeList();
      setManageEmployeeData(res);
    } catch (err) {
    //   console.error('===fetchAllEmployee==error>>>>', err);
    }
  },[]);
  
  return { manageEmployeeData, refetch: fetchAllEmployee };
};

export default useGetAllEmployee;

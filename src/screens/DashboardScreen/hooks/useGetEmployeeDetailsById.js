import { useState, useCallback } from 'react';
import { getEmployeeDetailsById } from '../api/dashboardService';

const useGetEmployeeDetailsById = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeDetails = useCallback(async (payload) => {
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getEmployeeDetailsById(payload);
      setEmployeeDetails(res);
    } catch (err) {
      // console.error('Error fetching employee details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { employeeDetails, isLoading, refetch: fetchEmployeeDetails };
};

export default useGetEmployeeDetailsById;

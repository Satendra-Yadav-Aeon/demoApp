import { useState, useCallback } from 'react';
import { getSupervisorRoleList } from '../api/employeeService';

const useSupervisorRoleLists = () => {
  const [supervisorList, setSupervisorList] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchSupervisorList = useCallback(async (payload) => {
    if (!payload) return;

    setIsLoading(true);
    try {
      const res = await getSupervisorRoleList(payload);
      setSupervisorList(res);
    } catch (err) {
      // console.error('Error fetching Supervisor List:', err);
    } finally {
      setIsLoading(false);
    }
  },[]);

  return { supervisorList, isLoading, refetchSupervisorList: fetchSupervisorList };
};

export default useSupervisorRoleLists;

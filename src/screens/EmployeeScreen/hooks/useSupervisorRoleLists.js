import { useEffect, useState } from 'react';
import { getSupervisorRoleList } from '../api/employeeService';

const useSupervisorRoleLists = () => {
  const [supervisorList, setSupervisorList] = useState([]); 

  useEffect(() => {
    fetchSupervisorList();
  }, []);

  const fetchSupervisorList = async () => {
    try {
      const supervisorRes = await getSupervisorRoleList();
      setSupervisorList(supervisorRes);
    } catch (err) {
      // console.error('===fetchSupervisorList==error>>>>', err);
    }
  };
  
  return { supervisorList };
};

export default useSupervisorRoleLists;

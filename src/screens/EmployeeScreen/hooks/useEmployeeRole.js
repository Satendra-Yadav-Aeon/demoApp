import { useEffect, useState } from 'react';
import { getEmployeeRole } from '../api/employeeService';

const useEmployeeRole = () => {
  const [employeeRole, setEmployeeRole] = useState([]); 

  useEffect(() => {
    fetchEmployeeRole();
  }, []);

  const fetchEmployeeRole = async () => {
    try {
      const roleRes = await getEmployeeRole();
      setEmployeeRole(roleRes);
    } catch (err) {
      // console.error('===fetchEmployeeRole==error>>>>', err);
    }
  };
  
  return { employeeRole };
};

export default useEmployeeRole;

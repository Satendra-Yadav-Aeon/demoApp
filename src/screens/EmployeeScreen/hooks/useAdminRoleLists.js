import { useEffect, useState } from 'react';
import { getAdminRoleList } from '../api/employeeService';

const useAdminRoleLists = () => {
  const [adminList, setAdminList] = useState([]); 

  useEffect(() => {
    fetchAdminList();
  }, []);

  const fetchAdminList = async () => {
    try {
      const adminRes = await getAdminRoleList();
      setAdminList(adminRes);
    } catch (err) {
      // console.error('===fetchAdminList==error>>>>', err);
    }
  };
  
  return { adminList };
};

export default useAdminRoleLists;

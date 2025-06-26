import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from '../screens/SettingScreen/components/Setting'
import Profile from '../screens/ProfileScreen/components/Profile'
import EmployeeDashboard from '../screens/DashboardScreen/components/EmployeeDashboard'
import SupervisorDashboard from '../screens/DashboardScreen/components/SupervisorDashboard'
import AdminDashboard from '../screens/DashboardScreen/components/AdminDashboard'
import { ROLES, SCREEN_ANIMATION, SCREENS } from '../constants/MainConstant'
import EmployeeTask from '../screens/TaskScreen/components/EmployeeTask'
import Report from '../screens/ReportScreen/components/Report'
import SupervisorAttendance from '../screens/AttendanceScreen/components/SupervisorAttendance'
import ManageEmployee from '../screens/EmployeeScreen/components/ManageEmployee'
import EmployeeAttendance from '../screens/AttendanceScreen/components/EmployeeAttendance'
import AdminAttendance from '../screens/AttendanceScreen/components/AdminAttendance'
import { AdminAttendanceProvider } from '../screens/AttendanceScreen/context/AdminAttendanceContext'
import GeofenceMap from '../components/GeofenceMap'
import ManageEmployeeList from '../screens/EmployeeScreen/components/ManageEmployeeList'
import ManageEmployeeForm from '../screens/EmployeeScreen/components/ManageEmployeeForm'
import SetEmployeeAttendance from '../screens/AttendanceScreen/components/SetEmployeeAttendance'
import { getAsyncItem } from '../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../constants/AsyncConstant'

const Stack = createNativeStackNavigator()
const ApplicationStack = () => {
  const [userRole, setUserRole] = useState(ROLES.EMPLOYEE)
  useEffect(() => {
    fetchAsyncData();
  },[])

  const fetchAsyncData = async() => {
    const data = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
    setUserRole(data?.rolename)
  }
  
  const getDashboardComponent = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return AdminDashboard;
      case ROLES.SUPERVISOR:
        return SupervisorDashboard;
      case ROLES.EMPLOYEE:
        return EmployeeDashboard;
      default:
        return EmployeeDashboard;
    }
  };

  const DashboardComponent = getDashboardComponent(userRole);

  return (
      <Stack.Navigator screenOptions={{headerShown: false, animation: SCREEN_ANIMATION}}>
        <Stack.Screen name={SCREENS.DASHBOARD} component={DashboardComponent}/>
        <Stack.Screen name={SCREENS.SETTING} component={Setting}/>
        <Stack.Screen name={SCREENS.PROFILE} component={Profile}/>
        <Stack.Screen name={SCREENS.EMPLOYEE_ATTENDANCE} component={EmployeeAttendance}/>
        <Stack.Screen name={SCREENS.EMPLOYEE_TASK} component={EmployeeTask}/>
        <Stack.Screen name={SCREENS.REPORT} component={Report}/>
        <Stack.Screen name={SCREENS.SUPERVISOR_ATTENDANCE} component={SupervisorAttendance}/>
        <Stack.Screen name={SCREENS.MANAGE_EMPLOYEE} component={ManageEmployee}/>
        <Stack.Screen name={SCREENS.GEOFENCE_MAP} component={GeofenceMap}/>
        <Stack.Screen name={SCREENS.ADMIN_ATTENDANCE}>
          {() => (
            <AdminAttendanceProvider>
              <AdminAttendance />
            </AdminAttendanceProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.MANAGE_EMPLOYEE_LIST} component={ManageEmployeeList}/>
        <Stack.Screen name={SCREENS.MANAGE_EMPLOYEE_FORM} component={ManageEmployeeForm}/>
        <Stack.Screen name={SCREENS.SET_EMPLOYEE_ATTENDANCE} component={SetEmployeeAttendance}/>
      </Stack.Navigator>
  )
}

export default ApplicationStack
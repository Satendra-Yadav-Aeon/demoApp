import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Setting from '../screens/SettingScreen/components/Setting'
import Profile from '../screens/ProfileScreen/components/Profile'
import EmployeeDashboard from '../screens/DashboardScreen/components/EmployeeDashboard'
import SupervisorDashboard from '../screens/DashboardScreen/components/SupervisorDashboard'
import AdminDashboard from '../screens/DashboardScreen/components/AdminDashboard'
import { ROLES, SCREEN_ANIMATION, SCREENS } from '../constants/MainConstant'
import EmployeeAttendance from '../screens/AttendanceScreen/components/EmployeeAttendance'
import EmployeeTask from '../screens/TaskScreen/components/EmployeeTask'
import Report from '../screens/ReportScreen/components/Report'
import SupervisorAttendance from '../screens/AttendanceScreen/components/SupervisorAttendance'
import AdminAttendance from '../screens/AttendanceScreen/components/AdminAttendance'
import ManageEmployee from '../screens/EmployeeScreen/components/ManageEmployee'

const Stack = createNativeStackNavigator()
const ApplicationStack = () => {
  const userRole = ROLES.EMPLOYEE;

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
        <Stack.Screen name={SCREENS.ADMIN_ATTENDANCE} component={AdminAttendance}/>
        <Stack.Screen name={SCREENS.MANAGE_EMPLOYEE} component={ManageEmployee}/>
      </Stack.Navigator>
  )
}

export default ApplicationStack
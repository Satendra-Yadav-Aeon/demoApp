import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DASHBOARD_SCREEN, PROFILE_SCREEN, ROLES, SCREEN_ANIMATION, SETTING_SCREEN } from '../constants/MainConstant'
import Setting from '../screens/SettingScreen/components/Setting'
import Profile from '../screens/ProfileScreen/components/Profile'
import EmployeeDashboard from '../screens/DashboardScreen/components/EmployeeDashboard'
import SupervisorDashboard from '../screens/DashboardScreen/components/SupervisorDashboard'
import AdminDashboard from '../screens/DashboardScreen/components/AdminDashboard'

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
        <Stack.Screen name={DASHBOARD_SCREEN} component={DashboardComponent}/>
        <Stack.Screen name={SETTING_SCREEN} component={Setting}/>
        <Stack.Screen name={PROFILE_SCREEN} component={Profile}/>
      </Stack.Navigator>
  )
}

export default ApplicationStack
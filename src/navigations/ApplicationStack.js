import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Dashboard from '../screens/DashboardScreen/components/Dashboard'
import { DASHBOARD_SCREEN, PROFILE_SCREEN, SETTING_SCREEN } from '../constants/MainConstant'
import Setting from '../screens/SettingScreen/components/Setting'
import Profile from '../screens/ProfileScreen/components/Profile'

const Stack = createNativeStackNavigator()
const ApplicationStack = () => {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={DASHBOARD_SCREEN} component={Dashboard}/>
        <Stack.Screen name={SETTING_SCREEN} component={Setting}/>
        <Stack.Screen name={PROFILE_SCREEN} component={Profile}/>
      </Stack.Navigator>
  )
}

export default ApplicationStack
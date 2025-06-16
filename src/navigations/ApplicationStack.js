import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Dashboard from '../screens/DashboardScreen/Dashboard'
import { DASHBOARD_SCREEN } from '../constants/MainConstant'

const Stack = createNativeStackNavigator()
const ApplicationStack = () => {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={DASHBOARD_SCREEN} component={Dashboard}/>
      </Stack.Navigator>
  )
}

export default ApplicationStack
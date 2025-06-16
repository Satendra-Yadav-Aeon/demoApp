import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Dashboard from '../screens/DashboardScreen/Dashboard'

const Stack = createNativeStackNavigator()
const ApplicationStack = () => {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='Dashboard' component={Dashboard}/>
      </Stack.Navigator>
  )
}

export default ApplicationStack
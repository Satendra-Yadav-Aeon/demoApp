import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/LoginScreen/components/Login'
import { SCREENS } from '../constants/MainConstant'

const Stack = createNativeStackNavigator()
const LoginStack = () => {
  return ( 
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={SCREENS.LOGIN} component={Login}/>
      </Stack.Navigator>
  )
}

export default LoginStack
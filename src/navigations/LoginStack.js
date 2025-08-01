import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/LoginScreen/components/Login'
import { SCREENS } from '../constants/MainConstant'
import IntroScreen from '../screens/IntroScreen/components/IntroScreen'

const Stack = createNativeStackNavigator()
const LoginStack = () => {

  return ( 
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={SCREENS.INTRO} component={IntroScreen} />
        <Stack.Screen name={SCREENS.LOGIN} component={Login}/>
      </Stack.Navigator>
  )
}

export default LoginStack
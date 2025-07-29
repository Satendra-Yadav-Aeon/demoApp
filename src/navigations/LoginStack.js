import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import Login from '../screens/LoginScreen/components/Login'
import { LARGE_LOADER, SCREENS } from '../constants/MainConstant'
import IntroScreen from '../screens/IntroScreen/components/IntroScreen'
import { getAsyncItem } from '../utils/AsyncStorage'
import { ASYNC_CONSTANT } from '../constants/AsyncConstant'
import Colors from '../assets/colors/colors'

const Stack = createNativeStackNavigator()
const LoginStack = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    const checkIntro = async () => {
      const seen = await getAsyncItem(ASYNC_CONSTANT.HAS_SEEN_INTRO);
      setHasSeenIntro(seen === 'true');
      setIsLoading(false);
    };
    checkIntro();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.conatiner}>
        <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
      </View>
    );
  }
  return ( 
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!hasSeenIntro && (
          <Stack.Screen name={SCREENS.INTRO} component={IntroScreen} />
        )}
        <Stack.Screen name={SCREENS.LOGIN} component={Login}/>
      </Stack.Navigator>
  )
}

export default LoginStack

const styles = StyleSheet.create({
  conatiner: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.white
  }
})
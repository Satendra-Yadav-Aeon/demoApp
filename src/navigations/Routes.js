import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ApplicationStack from './ApplicationStack';
import LoginStack from './LoginStack';
import { getAsyncItem } from '../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import Colors from '../assets/colors/colors';
import { LARGE_LOADER } from '../constants/MainConstant';

const Routes = () => {
  const { user, isLoading } = useSelector(state => state.login);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
  checkLoginStatus();
}, [user]);

const checkLoginStatus = async () => {
    try {
      const storedData = await getAsyncItem(ASYNC_CONSTANT.LOGIN_DATA);
      if (storedData?.token) {
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading || isLoading) {
    return (
      <View style={styles.conatiner}>
        <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <ApplicationStack /> : <LoginStack />}
    </NavigationContainer>
  );
}

export default Routes;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.white
  }
})

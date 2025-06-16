import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import ApplicationStack from './ApplicationStack';
import LoginStack from './LoginStack';

const Routes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      {isLoggedIn ? <ApplicationStack /> : <LoginStack />}
    </NavigationContainer>
  );
}

export default Routes;

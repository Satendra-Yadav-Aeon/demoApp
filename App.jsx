import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import { ANDROID_PLATFORM } from './src/constants/MainConstant';
import store from './src/redux/store';
import { setAsyncItem } from './src/utils/AsyncStorage';
import Routes from './src/navigations/Routes';
import './i18n';
import { loadSavedLanguage } from './src/utils/i18nLoader';
import { ASYNC_CONSTANT } from './src/constants/AsyncConstant';
import { NotificationProvider } from './src/screens/DashboardScreen/context/NotificationContext';


const App = () => {
  useEffect(() => {
    // Store version name in AsyncStorage

    const setAppVersion = async() => {
      const version = DeviceInfo.getVersion();
      await setAsyncItem(ASYNC_CONSTANT.APP_VERSION, version)
    }

    loadSavedLanguage();
    setAppVersion();  
  }, []);

  useEffect(() => {
    if(Platform.OS === ANDROID_PLATFORM){
      SplashScreen.hide();
    }
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <NotificationProvider>
        <Routes/>
        <Toast/>
        </NotificationProvider>
      </Provider> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

export default App
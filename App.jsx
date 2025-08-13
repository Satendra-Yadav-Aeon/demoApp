import { StyleSheet, SafeAreaView, Platform, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import { ANDROID_PLATFORM, BLOCK_ALERT_CONSTANT, LARGE_LOADER } from './src/constants/MainConstant';
import store from './src/redux/store';
import { setAsyncItem } from './src/utils/AsyncStorage';
import Routes from './src/navigations/Routes';
import './i18n';
import { loadSavedLanguage } from './src/utils/i18nLoader';
import { ASYNC_CONSTANT } from './src/constants/AsyncConstant';
import { NotificationProvider } from './src/screens/DashboardScreen/context/NotificationContext';
import { isDeviceTimeTampered } from './src/utils/trustedTime';
import Colors from './src/assets/colors/colors';
import BlockerAlert from './src/common/BlockerAlert';


const App = () => {
  const [blockType, setBlockType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runChecks = async () => {
      const timeTampered = await isDeviceTimeTampered();
      if (timeTampered) {
        setBlockType(BLOCK_ALERT_CONSTANT.TIME_BLOCK);
        setLoading(false);
        return;
      }

      setBlockType(null); // all good
      setLoading(false);
    };

    runChecks();
  }, []);


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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Provider store={store}>
        <NotificationProvider>
          {blockType ? (
            <BlockerAlert visible={true} type={blockType} />
          ) : (
            <>
              <Routes />
              <Toast />
            </>
          )}
        </NotificationProvider>
      </Provider> 
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.white
  }
})

export default App
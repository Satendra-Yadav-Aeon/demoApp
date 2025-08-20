import { StyleSheet, SafeAreaView, Platform, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import { ANDROID_PLATFORM, LARGE_LOADER } from './src/constants/MainConstant';
import store from './src/redux/store';
import { setAsyncItem } from './src/utils/AsyncStorage';
import Routes from './src/navigations/Routes';
import './i18n';
import { loadSavedLanguage } from './src/utils/i18nLoader';
import { ASYNC_CONSTANT } from './src/constants/AsyncConstant';
import { NotificationProvider } from './src/screens/DashboardScreen/context/NotificationContext';
import Colors from './src/assets/colors/colors';
import BlockerAlert from './src/common/BlockerAlert';
import { BlockerProvider, useBlocker } from './src/common/BlockerProvider';

const MainApp = () => {
  const { blockType } = useBlocker();

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
  );
};


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const version = DeviceInfo.getVersion();
      await setAsyncItem(ASYNC_CONSTANT.APP_VERSION, version);
      loadSavedLanguage();

      if (Platform.OS === ANDROID_PLATFORM) {
        SplashScreen.hide();
      }

      setLoading(false);
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={LARGE_LOADER} color={Colors.red} />
      </View>
    );
  }

  return (
    <BlockerProvider>
      <MainApp />
    </BlockerProvider>
  );
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
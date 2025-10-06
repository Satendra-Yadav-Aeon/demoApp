import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  ActivityIndicator,
  AppState,
} from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import {
  ANDROID_PLATFORM,
  LARGE_LOADER,
  BLOCK_ALERT_CONSTANT,
} from './src/constants/MainConstant';
import store from './src/redux/store';
import { setAsyncItem } from './src/utils/AsyncStorage';
import Routes from './src/navigations/Routes';
import './i18n';
import { loadSavedLanguage } from './src/utils/i18nLoader';
import { ASYNC_CONSTANT } from './src/constants/AsyncConstant';
import { NotificationProvider } from './src/screens/DashboardScreen/context/NotificationContext';
import Colors from './src/assets/colors/colors';
import BlockerAlert from './src/common/BlockerAlert';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [blockType, setBlockType] = useState(null);

  // refs to avoid race conditions and concurrent checks
  const mountedRef = useRef(true);
  const timeCheckInProgressRef = useRef(false);
  const netUnsubscribeRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const appStateSubRef = useRef(null);

  // Initialization — non-blocking
  useEffect(() => {
    mountedRef.current = true;

    const initApp = async () => {
      try {
        const version = DeviceInfo.getVersion();
        setAsyncItem(ASYNC_CONSTANT.APP_VERSION, version).catch(() => {});
        loadSavedLanguage().catch(() => {});
      } finally {
        if (Platform.OS === ANDROID_PLATFORM) {
          try { SplashScreen.hide(); } catch (e) {}
        }
        setLoading(false);

        // start listeners and background checks AFTER UI visible
        startListenersAndInitialChecks();
      }
    };

    initApp();

    return () => {
      mountedRef.current = false;
      cleanupListeners();
    };
  }, []);

  // Handle NetInfo state changes
  const handleNetState = useCallback((state) => {
    if (!mountedRef.current) return;

    const connected =
      !!state.isConnected && (state.isInternetReachable !== false);

    if (!connected) {
      setBlockType(BLOCK_ALERT_CONSTANT.INTERNET_BLOCK);
      return;
    }
    // but still run the time tamper check in background.
    setBlockType((prev) =>
      prev === BLOCK_ALERT_CONSTANT.TIME_BLOCK ? prev : null
    );

    // run time tamper check (won't block UI)
    if(Platform.OS === ANDROID_PLATFORM){
      runTimeTamperCheck();
    }
  }, []);

  const runTimeTamperCheck = useCallback(async () => {
    if (timeCheckInProgressRef.current) return;
    timeCheckInProgressRef.current = true;

    try {
      const tampered = await isDeviceTimeTampered();
      if (!mountedRef.current) return;

      if (tampered) {
        setBlockType(BLOCK_ALERT_CONSTANT.TIME_BLOCK);
      } else {
        // only clear if currently not on an internet block
        setBlockType((prev) =>
          prev === BLOCK_ALERT_CONSTANT.INTERNET_BLOCK ? prev : null
        );
      }
    } catch (e) {
      // keep whatever state
    } finally {
      timeCheckInProgressRef.current = false;
    }
  }, []);

  const runChecks = useCallback(() => {
    NetInfo.fetch().then(handleNetState).catch(() => {});
  }, [handleNetState]);

  // Start NetInfo & AppState listeners and run an initial NetInfo.fetch()
  const startListenersAndInitialChecks = () => {
    // initial quick fetch (non-blocking)
    NetInfo.fetch().then((state) => handleNetState(state)).catch(() => {});

    // live listener with debounce to avoid flicker on transient changes
    netUnsubscribeRef.current = NetInfo.addEventListener((state) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        handleNetState(state);
      }, 250); // 250ms debounce
    });

    // AppState -> re-run checks when app becomes active
    appStateSubRef.current = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        NetInfo.fetch().then((state) => handleNetState(state)).catch(() => {});
      }
    });
  };

  const cleanupListeners = () => {
    if (netUnsubscribeRef.current && typeof netUnsubscribeRef.current === 'function') {
      try { netUnsubscribeRef.current(); } catch (e) {}
      netUnsubscribeRef.current = null;
    }
    if (appStateSubRef.current && typeof appStateSubRef.current.remove === 'function') {
      try { appStateSubRef.current.remove(); } catch (e) {}
      appStateSubRef.current = null;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

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
            <BlockerAlert visible={true} type={blockType} onRetry={runChecks} />
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
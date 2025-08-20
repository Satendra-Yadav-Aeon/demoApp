import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { isInternetConnected } from "../utils/checkInternet";
import { BLOCK_ALERT_CONSTANT } from "../constants/MainConstant";
import { isDeviceTimeTampered } from "../utils/trustedTime";

const BlockerContext = createContext({
  blockType: null,
  setBlockType: () => {},
  runChecks: () => {},
});

export const BlockerProvider = ({ children }) => {
  const [blockType, setBlockType] = useState(null);

  // runChecks logic
  const runChecks = async () => {
    try {
      // Step 1: Check Internet
      const netInfo = await isInternetConnected();
      if (!netInfo) {
        setBlockType(BLOCK_ALERT_CONSTANT.INTERNET_BLOCK);
        return;
      }

      // Step 2: Check Time Tampering
      const timeTampered = await isDeviceTimeTampered();
      if (timeTampered) {
        setBlockType(BLOCK_ALERT_CONSTANT.TIME_BLOCK);
      } else {
        setBlockType(null); // all good
      }
    } catch (err) {
      setBlockType(null);
    }
  };

  // Run once on mount
  useEffect(() => {
    runChecks();
  }, []);

  // Re-run checks when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active") runChecks();
    });
    return () => subscription.remove();
  }, []);

  // Live internet listener (instant reaction)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected || !state.isInternetReachable) {
        setBlockType(BLOCK_ALERT_CONSTANT.INTERNET_BLOCK);
      } else {
        // If internet back, re-run full check (including time)
        runChecks();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <BlockerContext.Provider value={{ blockType, setBlockType, runChecks }}>
      {children}
    </BlockerContext.Provider>
  );
};

export const useBlocker = () => useContext(BlockerContext);

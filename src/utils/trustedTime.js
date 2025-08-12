import { getAsyncItem, setAsyncItem } from './AsyncStorage';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { BaseConfigUrl } from '../env/BaseConfigUrl';

// Get current IST time from API
const getTrustedTimeFromAPI = async () => {
  try {
    const res = await fetch(BaseConfigUrl.TIME_API_URL);
    const data = await res.json();
    const trustedTime = new Date(data.dateTime);
    const deviceTime = new Date();

    // Save to cache
    await setAsyncItem(ASYNC_CONSTANT.TRUSTED_TIME_SNAPSHOTS, 
      {
        trustedTime: trustedTime.toISOString(),
        deviceTime: deviceTime.toISOString(),
      })

    return trustedTime;
  } catch (e) {
    // console.warn('Failed to fetch trusted time:', e);
    return null;
  }
};

// Estimate trusted time from cache
const getEstimatedTrustedTime = async () => {
  try {
    const json = await getAsyncItem(ASYNC_CONSTANT.TRUSTED_TIME_SNAPSHOTS);
    if (!json) return null;

    const { trustedTime, deviceTime } = json;
    const trustedBase = new Date(trustedTime);
    const deviceBase = new Date(deviceTime);
    const now = new Date();

    const offset = now.getTime() - deviceBase.getTime();
    return new Date(trustedBase.getTime() + offset);
  } catch (e) {
    // console.warn('Failed to estimate trusted time:', e);
    return null;
  }
};

// Public function to get best available time
export const getCurrentTrustedTime = async () => {
  const onlineTime = await getTrustedTimeFromAPI();
  if (onlineTime) return onlineTime;

  const offlineTime = await getEstimatedTrustedTime();
  if (offlineTime) return offlineTime;

  // console.warn('Using fallback device time (less secure)');
  return new Date();
};

// Compare device time vs trusted time
export const isDeviceTimeTampered = async () => {
  const trustedTime = await getCurrentTrustedTime();
  const deviceTime = new Date();

  // Allow a 2-minute difference
  const diffMinutes = Math.abs((deviceTime - trustedTime) / 1000 / 60);
  return diffMinutes > 2;
};

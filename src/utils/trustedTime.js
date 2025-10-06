import { BaseConfigUrl } from '../env/BaseConfigUrl';

export const isDeviceTimeTampered = async () => {
  try {
    // Fetch trusted time from API
    const res = await fetch(BaseConfigUrl.TIME_API_URL);
    if (!res.ok) return false;
    const data = await res.json();
    const trustedTime = new Date(data.dateTime);
    const deviceTime = new Date();

    // Difference in minutes
    const diffMinutes = Math.abs((deviceTime.getTime() - trustedTime.getTime()) / 60000);

    // Return true if difference is more than 3 minutes
    return diffMinutes > 3;
  } catch (e) {
    // console.warn('Time check failed', e);
    return false;
  }
};

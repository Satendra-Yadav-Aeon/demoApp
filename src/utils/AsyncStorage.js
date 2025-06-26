import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    // console.error('==AsyncStorage======setItem>>>>>', error);
  }
};

export const getAsyncItem = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    // console.error('==AsyncStorage======getItem>>>>>', error)
    return null;
  }
};

export const removeAsyncItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // console.error('==AsyncStorage======removeItem>>>>>', error)
  }
};
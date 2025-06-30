import i18n from '../../i18n';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { getAsyncItem } from './AsyncStorage';

export const loadSavedLanguage = async () => {
  try {
    const savedLang = await getAsyncItem(ASYNC_CONSTANT.USER_LANGUAGE);
    if (savedLang) {
      await i18n.changeLanguage(savedLang);
    }
  } catch (e) {
    // console.error('Failed to load language from storage', e);
  }
};

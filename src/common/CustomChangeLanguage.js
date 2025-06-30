import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '../assets/colors/colors';
import ScreenDimensions from '../utils/DimensionUtils';
import { setAsyncItem } from '../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../constants/AsyncConstant';
import { LANGUAGE_CONSTANT } from '../screens/LoginScreen/constants/LoginConstant';
import { SELECT_LANGUAGE, SLIDE_ANIMATION } from '../constants/MainConstant';

const { screenHeight } = ScreenDimensions;

export const LANGUAGES = [
  { label: LANGUAGE_CONSTANT.ENGLISH_LABEL, code: LANGUAGE_CONSTANT.ENGLISH_CODE },
  { label: LANGUAGE_CONSTANT.HINDI_LABEL, code: LANGUAGE_CONSTANT.HINDI_CODE },
  { label: LANGUAGE_CONSTANT.MARATHI_LABEL, code: LANGUAGE_CONSTANT.MARATHI_CODE },
  { label: LANGUAGE_CONSTANT.GUJARATI_LABEL, code: LANGUAGE_CONSTANT.GUJARATI_CODE },
];

const CustomChangeLanguage = ({ visible, onClose }) => {
  const { i18n, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  useEffect(() => {
    if (i18n?.language) {
      setSelectedLang(i18n.language);
    }
  }, [i18n.language]);

  const changeLanguage = async (langCode) => {
    try {
      await setAsyncItem(ASYNC_CONSTANT.USER_LANGUAGE, langCode);
      i18n.changeLanguage(langCode);
      setSelectedLang(langCode);
      onClose()
    } catch (e) {
      // console.error('Failed to save language', e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType={SLIDE_ANIMATION} onRequestClose={onClose}>
      <View style={styles.modalWrapper}>
        <View style={styles.languageModal}>
          <Text style={styles.modalTitle}>{t(SELECT_LANGUAGE)}</Text>
          {LANGUAGES.map((item) => (
            <TouchableOpacity key={item.code} onPress={() => changeLanguage(item.code)} style={styles.langItem}>
              <Text style={[styles.langText, selectedLang === item.code && styles.langSelected]}>
                {t(item.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default CustomChangeLanguage;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  languageModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: screenHeight * 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  langItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  langText: {
    fontSize: 16,
    color: Colors.black,
  },
  langSelected: {
    color: Colors.red,
    fontWeight: 'bold',
  },
});

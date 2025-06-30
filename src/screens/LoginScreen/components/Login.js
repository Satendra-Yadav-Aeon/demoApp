import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MyImages from '../../../utils/MyImages'
import { HANDLED_TEXT, LANGUAGE_CONSTANT, LOGIN_HEADER, MOBILE_CONSTANT, NONE_TEXT, NUMBER_KEYPAD, PASSWORD_CONSTANT, SUBMIT_BUTTON_TEXT } from '../constants/LoginConstant';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { loginRequest } from '../redux/loginAction';
import { SLIDE_ANIMATION, SMALL_LOADER } from '../../../constants/MainConstant';
import { setAsyncItem } from '../../../utils/AsyncStorage';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';


const { screenWidth, screenHeight } = ScreenDimensions;

const LANGUAGES = [
  { label: LANGUAGE_CONSTANT.ENGLISH_LABEL, code: LANGUAGE_CONSTANT.ENGLISH_CODE },
  { label: LANGUAGE_CONSTANT.HINDI_LABEL, code: LANGUAGE_CONSTANT.HINDI_CODE },
  { label: LANGUAGE_CONSTANT.MARATHI_LABEL, code: LANGUAGE_CONSTANT.MARATHI_CODE },
  { label: LANGUAGE_CONSTANT.GUJARATI_LABEL, code: LANGUAGE_CONSTANT.GUJARATI_CODE },
];

const Login = () => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const { isLoading } = useSelector(state => state.login);
  const[showPassword, setShowPassword] = useState(false);
  const [isLangModalVisible, setLangModalVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGE_CONSTANT.ENGLISH_CODE);
  const {control, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      mobileNumber: '',
      password: ''
    }
  })
  

  useEffect(() => {
    if (i18n && i18n.language) {
    setSelectedLang(i18n.language);
  }
  },[i18n])

  const onSubmit = (data) => {
    dispatch(loginRequest(data));
  }

  const getLanguageLabel = (code) => {
    const found = LANGUAGES.find((lang) => lang.code === code);
    return found ? found.label : code.toUpperCase();
  };

  const changeLanguage = async (langCode) => {
    try {
      await setAsyncItem(ASYNC_CONSTANT.USER_LANGUAGE, langCode);
      i18n.changeLanguage(langCode);
      setSelectedLang(langCode);
      setLangModalVisible(false);
    } catch (e) {
      // console.error('Failed to save language', e);
    }
  };


  return (
    <View style={styles.container}>
      {/* Language Selector at Top Right */}
      <TouchableOpacity onPress={() => setLangModalVisible(true)} style={styles.languageButton}>
        <Text style={styles.languageText}>{getLanguageLabel(selectedLang)}</Text>
      </TouchableOpacity>

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={HANDLED_TEXT}>
      <Image source={MyImages.app_logo} style={styles.logoIcon}/>
      <Text style={styles.loginHeader}>{t(LOGIN_HEADER)}</Text>
      <Controller
        control={control}
        rules={{
          required: { value: true, message: t(MOBILE_CONSTANT.REQUIRED_ERROR) },  
          pattern: {
            value: MOBILE_CONSTANT.PATTERN_1,
            message: t(MOBILE_CONSTANT.PATTERN_ERROR),
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={t(MOBILE_CONSTANT.PLACEHOLDER)}
            placeholderTextColor={Colors.black}
            maxLength={10}
            onChangeText={onChange}
            value={value}
            style={styles.inputText}
            keyboardType={NUMBER_KEYPAD}
          />
        )}
        name={MOBILE_CONSTANT.NAME}
      />
      {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: { value: true, message: t(PASSWORD_CONSTANT.REQUIRED_ERROR) }
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.passwordContainer}>
          <TextInput
            placeholder={t(PASSWORD_CONSTANT.PLACEHOLDER)}
            placeholderTextColor={Colors.black}
            onChangeText={onChange}
            value={value}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            autoCapitalize={NONE_TEXT}
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeButton} activeOpacity={0.7}>
            <Image
              source={showPassword ? MyImages.view : MyImages.hide}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
          </View>
        )}
        name={PASSWORD_CONSTANT.NAME}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size={SMALL_LOADER} color={Colors.white}/>
        ) : (
          <Text style={styles.submitText}>{t(SUBMIT_BUTTON_TEXT)}</Text>
        )}     
      </TouchableOpacity>
      </KeyboardAwareScrollView>
      {/* Language Modal */}
      <Modal
        visible={isLangModalVisible}
        transparent
        animationType={SLIDE_ANIMATION}
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.languageModal}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {LANGUAGES.map((item) => (
              <TouchableOpacity key={item.code} onPress={() => changeLanguage(item.code)} style={styles.langItem}>
                <Text style={[styles.langText, selectedLang === item.code && styles.langSelected]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: Colors.bgColor,
      paddingBottom: 20,
      justifyContent: 'center'
    },
    scrollContainer: {
      flexGrow: 1,
    },
    logoIcon: {
      width: screenWidth * 0.80,
      height: screenHeight * 0.35,
      marginTop: screenHeight * 0.05,
      resizeMode: 'cover',
      alignSelf: 'center',
    },
    loginHeader: {
      color: Colors.black,
      fontSize: 25,
      fontWeight: 'bold',
      margin: 20
    },
    inputText: {
      borderWidth:1,
      width: screenWidth * 0.90,
      margin: 20,
      height: screenHeight * 0.06,
      borderRadius:4,
      fontSize: 18,
      color: Colors.black
    },
    errorText: {
      color: Colors.red,
      marginLeft: 20,
      marginBottom:10
    },
    submitButton: {
      backgroundColor: Colors.red,
      width: screenWidth * 0.90,
      height: screenHeight * 0.06,
      borderRadius:4,
      margin: 20,
      justifyContent: 'center',  
      alignItems  : 'center',
    },
    submitText: {
      color: Colors.white,
      fontSize: 22
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 4,
      marginHorizontal: 20,
      marginBottom: 10,
      height: screenHeight * 0.06,
    },
    passwordInput: {
      flex: 1,
      fontSize: 18,
      color: Colors.black,
    },

    eyeButton: {
      paddingRight: 20,
    },
    eyeIcon: {
      width: 24,
      height: 24,
      tintColor: Colors.black,
    },
    languageButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
      backgroundColor: Colors.white,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 6,
      elevation: 3
    },
    languageText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.black,
    },
    modalWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    languageModal: {
      backgroundColor: Colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: screenHeight * 0.5
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center'
    },
    langItem: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1
    },
    langText: {
      fontSize: 16,
      color: Colors.black
    },
    langSelected: {
      color: Colors.red,
      fontWeight: 'bold'
    }
})
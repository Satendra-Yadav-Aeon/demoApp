import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MyImages from '../../../utils/MyImages'
import { HANDLED_TEXT, LOGIN_HEADER, MOBILE_CONSTANT, NONE_TEXT, NUMBER_KEYPAD, PASSWORD_CONSTANT, SUBMIT_BUTTON_TEXT } from '../constants/LoginConstant';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { loginRequest } from '../redux/loginAction';
import { SMALL_LOADER } from '../../../constants/MainConstant';

const { screenWidth, screenHeight } = ScreenDimensions;

const Login = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation()
  const { isLoading } = useSelector(state => state.login);
  const[showPassword, setShowPassword] = useState(false);
  const {control, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      mobileNumber: '',
      password: ''
    }
  })

  const onSubmit = (data) => {
    dispatch(loginRequest(data));
  }


  return (
    <View style={styles.container}>
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
      width: screenWidth * 0.55,
      height: screenHeight * 0.25,
      marginTop: screenHeight * 0.10,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    loginHeader: {
      color: Colors.black,
      fontSize: 25,
      fontWeight: 'bold',
      margin: 20,
      marginTop: 70
    },
    inputText: {
      borderWidth:1,
      width: screenWidth * 0.90,
      margin: 20,
      height: screenHeight * 0.06,
      borderRadius:4,
      fontSize: 18,
      color: Colors.black,
      paddingLeft: 10
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
      width: '100%',
      textAlign: 'center',
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
      paddingLeft: 10
    },

    eyeButton: {
      paddingRight: 20,
    },
    eyeIcon: {
      width: 24,
      height: 24,
      tintColor: Colors.black,
    },
})
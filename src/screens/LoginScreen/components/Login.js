import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import MyImages from '../../../utils/MyImages'
import { LOGIN_HEADER, MOBILE_CONSTANT, NUMBER_KEYPAD, PASSWORD_CONSTANT, SUBMIT_BUTTON_TEXT } from '../constants/LoginConstant';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { loginRequest } from '../redux/loginAction';
import { SMALL_LOADER } from '../../../constants/MainConstant';

const { screenWidth, screenHeight } = ScreenDimensions;
const Login = () => {
  const dispatch = useDispatch();
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
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={'handled'}>
      <Image source={MyImages.app_logo} style={styles.logoIcon}/>
      <Text style={styles.loginHeader}>{LOGIN_HEADER}</Text>
      <Controller
        control={control}
        rules={{
          required: MOBILE_CONSTANT.REQUIRED_ERROR,
          pattern: {
            value: MOBILE_CONSTANT.PATTERN_1,
            message: MOBILE_CONSTANT.PATTERN_ERROR,
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={MOBILE_CONSTANT.PLACEHOLDER}
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
          required: PASSWORD_CONSTANT.REQUIRED_ERROR,
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.passwordContainer}>
          <TextInput
            placeholder={PASSWORD_CONSTANT.PLACEHOLDER}
            placeholderTextColor={Colors.black}
            onChangeText={onChange}
            value={value}
            secureTextEntry={!showPassword}
            style={styles.inputText}
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
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
          <Text style={styles.submitText}>{SUBMIT_BUTTON_TEXT}</Text>
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
      padding:10,
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
    },
    eyeIcon: {
      position: 'absolute',
      right: 30,
      transform: [{ translateY: -15 }],
      width: 30,
      height: 30,
    }
})
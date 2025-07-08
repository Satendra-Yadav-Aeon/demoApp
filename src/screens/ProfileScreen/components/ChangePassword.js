import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { SUBMIT_BUTTON_TEXT } from '../../LoginScreen/constants/LoginConstant';
import CustomTextInput from '../../../common/CustomTextInput';
import { SMALL_LOADER } from '../../../constants/MainConstant';
import { useSaveProfileAPI } from '../hooks/useSaveProfileAPI';
import { CONFIRM_PASSWORD_CONSTANT, CURRENT_PASSWORD_CONSTANT, NEW_PASSWORD_CONSTANT, PROFILE_CONSTANT } from '../constants/ProfileConstant';
import { useChangePasswordAPI } from '../hooks/useChangePasswordAPI';

const { screenWidth } = ScreenDimensions
const ChangePassword = () => {
	const navigation = useNavigation()
	const {t} = useTranslation()
  const route = useRoute();
  const { employeeData } = route.params || {};
  const {changePassword, isLoading} = useChangePasswordAPI()
	const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      [CURRENT_PASSWORD_CONSTANT.NAME]: '',
      [NEW_PASSWORD_CONSTANT.NAME]: '',
      [CONFIRM_PASSWORD_CONSTANT.NAME]: '',
    }
  });

  const newPassword = useWatch({ control, name: NEW_PASSWORD_CONSTANT.NAME });

	const onSubmit = (data) => {
   const saveData = {
    empid: employeeData?.empid,
    currPwd: data?.currPwd,
    newPwd: data?.cnfmPwd
   }
  //  console.log('====onSubmit====saveData=>>>>',saveData);
    const response = changePassword(saveData);
    if(response){
      navigation.goBack();
    }
    
  };
	
  return (
    <View style={styles.container}>
				<KeyboardAwareScrollView style={styles.scrollContainer}>
					<Controller
          control={control}
          name={CURRENT_PASSWORD_CONSTANT.NAME}
          rules={{
            required: t(CURRENT_PASSWORD_CONSTANT.REQUIRED_ERROR),
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(CURRENT_PASSWORD_CONSTANT.PLACEHOLDER)}
              label={t(CURRENT_PASSWORD_CONSTANT.LABEL)}
              maxLength={20}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />
				<Controller
          control={control}
          name={NEW_PASSWORD_CONSTANT.NAME}
          rules={{
            required: t(NEW_PASSWORD_CONSTANT.REQUIRED_ERROR),
            pattern: {
              value: PROFILE_CONSTANT.PASSWORD_PATTERN,
              message: t(NEW_PASSWORD_CONSTANT.PASSWORD_PATTERN_ERROR),
            },
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(NEW_PASSWORD_CONSTANT.PLACEHOLDER)}
              label={t(NEW_PASSWORD_CONSTANT.LABEL)}
              maxLength={20}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />
				<Controller
          control={control}
          name={CONFIRM_PASSWORD_CONSTANT.NAME}
          rules={{
            required: t(CONFIRM_PASSWORD_CONSTANT.REQUIRED_ERROR),
            validate: value => 
              value === newPassword || t(CONFIRM_PASSWORD_CONSTANT.CONFIRM_PASSWORD_MATCH_ERROR)
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(CONFIRM_PASSWORD_CONSTANT.PLACEHOLDER)}
              label={t(CONFIRM_PASSWORD_CONSTANT.LABEL)}
              maxLength={20}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />
				</KeyboardAwareScrollView>
				<TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={SMALL_LOADER} color={Colors.white}/>
            ) : (
              <Text style={styles.submitText}>{t(SUBMIT_BUTTON_TEXT)}</Text>
            )}
        </TouchableOpacity>
    </View>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.bgColor,
	},
	scrollContainer: {
    marginBottom: 20,
    top: 50,
  },
	submitButton: {
		position: 'absolute',
		bottom: 40,
    width: screenWidth * 0.90,
    backgroundColor: Colors.red,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 20,
  },
  submitText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
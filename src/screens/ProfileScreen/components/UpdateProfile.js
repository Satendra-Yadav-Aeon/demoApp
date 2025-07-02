import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { ADDRESS_CONSTANT, MOBILE_CONSTANT, NAME_CONSTANT, NUMBER_KEYPAD } from '../../EmployeeScreen/constants/ManageEmployeeConstant';
import { SUBMIT_BUTTON_TEXT } from '../../LoginScreen/constants/LoginConstant';
import CustomTextInput from '../../../common/CustomTextInput';
import { SCREEN_LOCALIZATION, SCREENS, SMALL_LOADER } from '../../../constants/MainConstant';
import { useSaveProfileAPI } from '../hooks/useSaveProfileAPI';
import { ASYNC_CONSTANT } from '../../../constants/AsyncConstant';
import { getAsyncItem } from '../../../utils/AsyncStorage';

const { screenWidth, screenHeight } = ScreenDimensions
const UpdateProfile = () => {
	const navigation = useNavigation()
	const {t} = useTranslation()
  const route = useRoute();
  const { employeeData } = route.params || {};
  const {saveProfile, isLoading} = useSaveProfileAPI()
  const[capturedImageUri, setCapturedImageUri] = useState()
	const { control, handleSubmit, reset, formState: { errors } } = useForm({
			defaultValues: {
				[NAME_CONSTANT.NAME]: '',
				[MOBILE_CONSTANT.NAME]: '',
				[ADDRESS_CONSTANT.NAME]: '',
			}
	});

	useEffect(() => {
		if (employeeData) {
			reset({
				[NAME_CONSTANT.NAME]: employeeData?.empname || '',
        [MOBILE_CONSTANT.NAME]: employeeData?.mobileno || '',
        [ADDRESS_CONSTANT.NAME]: employeeData?.address || '',
			});
		}
	}, [employeeData, reset]);

  useFocusEffect(
      React.useCallback(() => {
          const loadProfileImage = async () => {
            if(employeeData?.empid){
              const key = `${ASYNC_CONSTANT.PROFILE_IMAGE}_${employeeData?.empid}`
              const uri = await getAsyncItem(key);
              if (uri) {
                setCapturedImageUri(uri);
              }
            }
            
          };
          
            loadProfileImage();
        }, [employeeData])
    );


	// console.log('==UpdateProfile======employeeData>>>>>>>',employeeData);
  // console.log('==UpdateProfile======capturedImageUri>>>>>>>',capturedImageUri);

	const onSubmit = (data) => {
    // Generate formatted date: yyyy-mm-dd hh:mm:ss
  const now = new Date(); 
  const formattedDate = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + '-' +
    String(now.getMinutes()).padStart(2, '0') + '-' +
    String(now.getSeconds()).padStart(2, '0');

  const photoName = `${employeeData?.empid}_${formattedDate}.jpg`; // e.g., EMP01_2025-07-02 22:13:55.jpg
    const saveData = {
    empid: employeeData?.empid,
    mobileno: data?.mobile,
    address: data?.address,
    photo: capturedImageUri,
    photoname: photoName
  };

  // console.log('==UpdateProfile======onSubmit>>>>saveData>>>',saveData);
    const response = saveProfile(saveData);
    if(response){
      navigation.goBack();
    }j
    
  };
	
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate(SCREENS.CAPTURE_IMAGE,{employeeData})}>
        {capturedImageUri ? (
          <Image source={{uri: capturedImageUri}} style={styles.profileIcon} />
        ) : (
          <Image source={MyImages.profile} style={styles.profileIcon} />
        )}      
			</TouchableOpacity>
      <Text style={styles.captureText}>{t(SCREEN_LOCALIZATION.CAPTURE_IMAGE)}</Text>
			<View style={styles.formContainer}>
				<KeyboardAwareScrollView style={styles.scrollContainer}>
					<Controller
          control={control}
          name={NAME_CONSTANT.NAME}
          rules={{
            required: t(NAME_CONSTANT.REQUIRED_ERROR),
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(NAME_CONSTANT.PLACEHOLDER)}
              label={t(NAME_CONSTANT.LABEL)}
              maxLength={60}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
							disabled={true}
            />
          )}
        />
				<Controller
          control={control}
          name={MOBILE_CONSTANT.NAME}
          rules={{
            required: t(MOBILE_CONSTANT.REQUIRED_ERROR),
            pattern: {
              value: MOBILE_CONSTANT.PATTERN_1,
              message: t(MOBILE_CONSTANT.PATTERN_ERROR),
            },
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(MOBILE_CONSTANT.PLACEHOLDER)}
              label={t(MOBILE_CONSTANT.LABEL)}
              maxLength={10}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              keyboardType={NUMBER_KEYPAD}
              error={error?.message}
            />
          )}
        />
				<Controller
          control={control}
          name={ADDRESS_CONSTANT.NAME}
          rules={{
            required: t(ADDRESS_CONSTANT.REQUIRED_ERROR),
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={t(ADDRESS_CONSTANT.PLACEHOLDER)}
              label={t(ADDRESS_CONSTANT.LABEL)}
              maxLength={250}
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
    </View>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.bgColor
	},
	profileContainer: {
		backgroundColor: Colors.bgColor,
		width: screenWidth * 0.95,
		height: screenHeight * 0.25,
		alignItems: 'center', 
		overflow: 'hidden',
		margin:10
  },
  profileIcon: {
    width: '50%',
    height: '100%',
    borderColor: Colors.red,
    borderWidth: 2
  },
	captureText: {
    fontSize: 20,
    textAlign: 'center',
  },
	formContainer: {
		flex: 1,
	},
	scrollContainer: {
    marginTop: 20,
    marginBottom: 20
  },
	submitButton: {
		position: 'absolute',
		top: 400,
    width: screenWidth * 0.90,
    backgroundColor: Colors.red,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 20,
  },
  submitText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
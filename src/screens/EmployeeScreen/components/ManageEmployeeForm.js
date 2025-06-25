import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../../assets/colors/colors';
import MyImages from '../../../utils/MyImages';
import { ADD_EMPLOYEE_TITLE, ADDRESS_CONSTANT, DEPARTMENT_CONSTANT, JOINIG_DATE_CONSTANT, MANAGE_EMPLOYEE_CONSTANT, MOBILE_CONSTANT, NAME_CONSTANT, NUMBER_KEYPAD, ROLE_CONSTANT, UPDATE_EMPLOYEE_TITLE } from '../constants/ManageEmployeeConstant';
import ScreenDimensions from '../../../utils/DimensionUtils';
import CustomTextInput from '../../../common/CustomTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomDropdown from '../../../common/CustomDropdown';
import CustomDatePicker from '../../../common/CustomDatePicker';

const { screenWidth, screenHeight } = ScreenDimensions;
const ManageEmployeeForm = () => {
  const navigation = useNavigation()
  const { control, handleSubmit, setValue, formState: {errors} } = useForm();
  const route = useRoute();
  const { mode, employee } = route.params || {};
  const departmentOptions = [
    { label: 'Sales', value: 'Sales' },
    { label: 'HR', value: 'HR' },
    { label: 'Electrical', value: 'Electrical' },
  ];
  const roleOptions = [
    { label: 'Supervisor', value: 'Supervisor' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Employee', value: 'Employee' },
  ];


  useEffect(() => {
    if (mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE && employee) {
      Object.entries(employee).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [employee]);

  const onSubmit = (data) => {
    console.log('Employee Form Data:', data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>{mode === MANAGE_EMPLOYEE_CONSTANT.UPDATE_MODE ? UPDATE_EMPLOYEE_TITLE : ADD_EMPLOYEE_TITLE}</Text>
      </View>
      <View style={styles.secondHalf}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
        <Controller
          control={control}
          name={NAME_CONSTANT.NAME}
          rules={{
            required: NAME_CONSTANT.REQUIRED_ERROR,
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={NAME_CONSTANT.PLACEHOLDER}
              label={NAME_CONSTANT.LABEL}
              maxLength={60}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />  
        <Controller
          control={control}
          name={MOBILE_CONSTANT.NAME}
          rules={{
            required: MOBILE_CONSTANT.REQUIRED_ERROR,
            pattern: {
              value: MOBILE_CONSTANT.PATTERN_1,
              message: MOBILE_CONSTANT.PATTERN_ERROR,
            },
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={MOBILE_CONSTANT.PLACEHOLDER}
              label={MOBILE_CONSTANT.LABEL}
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
          name={DEPARTMENT_CONSTANT.NAME}
          rules={{ required: DEPARTMENT_CONSTANT.REQUIRED_ERROR }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <CustomDropdown
              label={DEPARTMENT_CONSTANT.LABEL}
              value={value}
              onChange={onChange}
              options={departmentOptions}
              error={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={ROLE_CONSTANT.NAME}
          rules={{ required: ROLE_CONSTANT.REQUIRED_ERROR }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <CustomDropdown
              label={ROLE_CONSTANT.LABEL}
              value={value}
              onChange={onChange}
              options={roleOptions}
              error={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name={JOINIG_DATE_CONSTANT.NAME}
          rules={{ required: JOINIG_DATE_CONSTANT.REQUIRED_ERROR }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDatePicker
              label={JOINIG_DATE_CONSTANT.LABEL}
              value={value}
              onChange={onChange}
              error={error?.message}
              minimumDate={new Date()}
            />
          )}
        />
        <Controller
          control={control}
          name={ADDRESS_CONSTANT.NAME}
          rules={{
            required: ADDRESS_CONSTANT.REQUIRED_ERROR,
          }}
          render={({ field: { onChange, value }, fieldState: {error} }) => (
            <CustomTextInput
              placeholder={ADDRESS_CONSTANT.PLACEHOLDER}
              label={ADDRESS_CONSTANT.LABEL}
              maxLength={250}
              onChange={onChange}
              value={value}
              style={styles.inputText}
              error={error?.message}
            />
          )}
        />
        </KeyboardAwareScrollView>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageEmployeeForm;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Colors.red,
  },
  firstHalf: {
    flex:1,
    backgroundColor: Colors.red,
    justifyContent: 'center',
  },
  secondHalf: {
    flex:5,
    backgroundColor: Colors.bgColor,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    borderColor: Colors.bgColor,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
    marginLeft: 10,
  },  
  scrollContainer: {
    marginTop: 20,
    marginBottom: 20
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 17
  },
  input: {
    height: 50,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  submitButton: {
    width: screenWidth * 0.90,
    backgroundColor: Colors.red,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 20
  },
  submitText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
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
});
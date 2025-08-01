import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CustomDropdown from '../../../common/CustomDropdown';
import Colors from '../../../assets/colors/colors';
import { SET_LOCATION_CONSTANT, SET_LOCATION_DROPDOWN } from '../constants/SetLocationConstants';
import MyImages from '../../../utils/MyImages';
import useGeofenceDropdownAPI from '../hooks/useGeofenceDropdownAPI';
import { useSaveGeofenceAPI } from '../hooks/useSaveGeofenceAPI';
import { SCREENS } from '../../../constants/MainConstant';

const SelectEmployeeGeofenceLocation = ({ route }) => {
  const navigation = useNavigation()
  const {t} = useTranslation()
  const { geofenceDropdown } = useGeofenceDropdownAPI();
  const {saveGeofenceLocation, isLoading} = useSaveGeofenceAPI();
  const { selectedEmployees } = route.params;
  const { control, handleSubmit, watch, formState: { errors } } = useForm();


  const locationOptions = geofenceDropdown?.map(loc => ({
    label: loc.locationName, 
    value: loc.locationId,
  }));

  const selectedLocation = watch('location');

  const onSubmit = (data) => {
    const geofenceData = selectedEmployees?.map(emp => ({
      empId: emp?.empid,
      locationId: data?.location
    }));
    // console.log("===onSubmit=====geofenceData==>>>>>", geofenceData);
    const response = saveGeofenceLocation(geofenceData);
    if (response) {
      navigation.reset({
        index: 1,
        routes: [
          { name: SCREENS.DASHBOARD },
          { name: SCREENS.SET_LOCATION, params: { shouldRefresh: true } },
        ],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.heading}>{t(SET_LOCATION_CONSTANT.SET_WORKING_LOCATION_TITLE)}</Text>
      </View>
      <Image source={MyImages.geofence} style={styles.geofenceStyle}/>
      <Controller
        control={control}
        name={SET_LOCATION_DROPDOWN.NAME}
        rules={{ required: t(SET_LOCATION_DROPDOWN.REQUIRED_ERROR) }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label={t(SET_LOCATION_DROPDOWN.LABEL)}
            options={locationOptions}
            value={value}
            onChange={onChange}
            error={error?.message}
            placeholder={t(SET_LOCATION_DROPDOWN.PLACEHOLDER)}
            containerStyle={styles.dropdownContainer}
          />
        )}
      />

      <Text style={styles.subHeading}>{t(SET_LOCATION_CONSTANT.SELECTED_EMPLOYEES)}</Text>
      <FlatList
        data={selectedEmployees}
        keyExtractor={(item) => item.empid}
        renderItem={({ item }) => (
          <Text style={styles.employeeText}>{item?.empname} - {item?.rolename}</Text>
        )}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        <Text style={styles.saveText} adjustsFontSizeToFit={true}>{t(SET_LOCATION_CONSTANT.SAVE)}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectEmployeeGeofenceLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  headingContainer: {
    marginTop: 30 
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.red,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18, 
    color: Colors.black,
    marginBottom: 4, 
    fontWeight: 'bold' ,
    marginVertical: 30
  },
  employeeText: {
    marginVertical: 4,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: Colors.red,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    fontSize: 18,
  },
  dropdownContainer: {
    margin: 0,
    marginTop: 30
  },
  geofenceStyle: {
    width: '100%',
    height: '40%',
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.red,
    marginLeft: 10,
  },
});

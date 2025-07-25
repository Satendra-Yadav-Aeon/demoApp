import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import ScreenDimensions from '../../../utils/DimensionUtils';
import MyImages from '../../../utils/MyImages';
import { BaseConfigUrl } from '../../../env/BaseConfigUrl';
import Colors from '../../../assets/colors/colors';
import { SET_LOCATION_CONSTANT } from '../constants/SetLocationConstants';

const { screenWidth } = ScreenDimensions

const SetEmployeeLocationCard = ({ employee, isSelected, onToggleSelect }) => {
  const {t} = useTranslation()
  const[profileImageUri, setProfileImageUri] = useState()
  
  useEffect(() => {
    if (employee?.photo) {
      setProfileImageUri(`${BaseConfigUrl.BASE_IMAGE_URL}${employee.photo}`);
    }

  },[employee])

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.roundImage} />
        ) : (
          <Image source={MyImages.profile} style={styles.profileIcon} />
        )}
        <View style={styles.nameRoleContainer}>
          <Text style={styles.name}>{employee?.empname}</Text>
          <Text style={styles.dataText}>{employee?.rolename}</Text>
          {employee?.geofenceLocationName ? (
            <Text style={styles.dataText}>{t(SET_LOCATION_CONSTANT.WORKING_LOCATION)} {employee?.geofenceLocationName}</Text>
          ) : (
            <Text style={styles.dataText}>{t(SET_LOCATION_CONSTANT.WORKING_LOCATION)} {SET_LOCATION_CONSTANT.NO_TIME}</Text>
          )}
        </View>
        <CheckBox
          value={isSelected}
          onValueChange={() => onToggleSelect(employee)}
          tintColors={{ true: Colors.red }}
        />
      </View>
    </View>
  );
};

export default SetEmployeeLocationCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.95,
    padding: 15,
    margin: 10,
    backgroundColor: Colors.bgColor,
    borderRadius: 20,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRoleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  dataText: {
    fontSize: 16,
    color: Colors.grey,
    fontWeight: '700',
  },
  roundImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  profileIcon: {
    width: 50,
    height: 50,
  },
});

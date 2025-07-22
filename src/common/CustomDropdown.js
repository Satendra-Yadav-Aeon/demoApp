import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '../assets/colors/colors';

const CustomDropdown = ({ label, value, onChange, options, error, placeholder , containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        onValueChange={onChange}
        value={value}
        items={options}
        useNativeAndroidPickerStyle={false}
        placeholder={{ label: placeholder, value: null }}
        style={{
          inputIOS: {
            color: Colors.black,
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.grey,
            borderRadius: 6,
            fontSize: 16,
          },
          inputAndroid: {
            color: Colors.black,
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.grey,
            borderRadius: 8,
            fontSize: 16,
          },
          placeholder: {
            fontSize: 16,
            color: Colors.grey
          }
        }}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  container: { 
    margin: 15
  },
  label: { 
    fontSize: 18, 
    color: Colors.black,
    marginBottom: 4, 
    fontWeight: 'bold' 
  },
  error: { 
    color: Colors.red_1, 
    marginTop: 4, 
    fontSize: 14 
  },
});

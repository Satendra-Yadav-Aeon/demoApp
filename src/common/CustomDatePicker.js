import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../assets/colors/colors';
import { DATE_MODE, DISPLAY_DEFAULT, DISPLAY_SPINNER, IOS_PLATFORM } from '../constants/MainConstant';

const CustomDatePicker = ({ label, value, onChange, error,minimumDate, placeholder }) => {
  const [show, setShow] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate.toISOString().split('T')[0]); // Format to yyyy-mm-dd
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={value ? styles.valueText : styles.placeholderText}>{value || placeholder}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode={DATE_MODE}
          display={Platform.OS === IOS_PLATFORM ? DISPLAY_SPINNER : DISPLAY_DEFAULT}
          onChange={onDateChange}
          minimumDate={minimumDate}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default CustomDatePicker;

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
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  error: { 
    color: Colors.red, 
    marginTop: 4, 
    fontSize: 14 
  },
  valueText: {
    color: Colors.black,
    fontSize: 16,
  },
  placeholderText: {
    color: Colors.grey,
    fontSize: 16,
  },
});

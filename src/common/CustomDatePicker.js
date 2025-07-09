import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../assets/colors/colors';
import { DISPLAY_DEFAULT, DISPLAY_SPINNER, IOS_PLATFORM } from '../constants/MainConstant';

const CustomDatePicker = ({ label, value, onChange, error, minimumDate, placeholder, mode = 'date', disabled }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const formatDateTime = (date, mode) => {
    const pad = (n) => (n < 10 ? `0${n}` : n);
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());

    if (mode === 'date') return `${yyyy}-${mm}-${dd}`;
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };


  const handlePress = () => {
    if (Platform.OS === 'android' && mode === 'datetime') {
      setShowDate(true);
    } else {
      setShowDate(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDate(false);
    if (selectedDate) {
      if (mode === 'datetime' && Platform.OS === 'android') {
        setTempDate(selectedDate);
        setShowTime(true); // show time picker next
      } else {
        const finalDate = formatDateTime(selectedDate, mode);
        onChange(finalDate);
      }
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTime(false);
    if (selectedTime) {
      const fullDate = new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      const finalDateTime = formatDateTime(fullDate, mode);
      onChange(finalDateTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.input, disabled && { backgroundColor: Colors.lightGrey }]}
        onPress={!disabled ? handlePress : null}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {!disabled && showDate && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode={mode === 'datetime' && Platform.OS === 'android' ? 'date' : mode}
          display={Platform.OS === IOS_PLATFORM ? DISPLAY_SPINNER : DISPLAY_DEFAULT}
          onChange={handleDateChange}
          minimumDate={minimumDate}
        />
      )}

      {!disabled && showTime && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display={Platform.OS === IOS_PLATFORM ? DISPLAY_SPINNER : DISPLAY_DEFAULT}
          onChange={handleTimeChange}
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

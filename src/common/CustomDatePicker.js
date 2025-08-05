import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Colors from '../assets/colors/colors';

const CustomDatePicker = ({
  label,
  value,
  onChange,
  error,
  minimumDate,
  placeholder,
  mode = 'date',
  disabled,
  labelStyle
}) => {
  const [open, setOpen] = useState(false);

  const formatDateTime = (date, mode) => {
    const pad = (n) => (n < 10 ? `0${n}` : n);
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    if (mode === 'date') return `${yyyy}-${mm}-${dd}`;
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  const handleConfirm = (selectedDate) => {
    setOpen(false);
    const finalDate = formatDateTime(selectedDate, mode);
    onChange(finalDate);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        style={styles.input}
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <DatePicker
        modal
        open={open}
        date={value ? new Date(value) : new Date()}
        mode={mode}
        minimumDate={minimumDate}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  label: {
    fontSize: 18,
    color: Colors.black,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  error: {
    color: Colors.red_1,
    marginTop: 4,
    fontSize: 14,
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

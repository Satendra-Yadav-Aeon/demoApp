import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '../assets/colors/colors';
import { DEFAULT_KEYBOARD_TYPE } from '../constants/MainConstant';
import { removeEmojisUtils } from '../utils/removeEmojisUtils';

const CustomTextInput = ({ label, value, onChange, placeholder, error, keyboardType = DEFAULT_KEYBOARD_TYPE, maxLength, disabled }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(removeEmojisUtils(text))}
        placeholder={placeholder || label}
        placeholderTextColor={Colors.grey}
        style={styles.input}
        maxLength={maxLength}
        keyboardType={keyboardType}
        multiline={true}
        editable={!disabled}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default CustomTextInput;

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
    fontSize: 16,
    color: Colors.black
  },
  error: { 
    color: Colors.red, 
    marginTop: 4, 
    fontSize: 14 
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { CLOSE_TXT, SLIDE_ANIMATION } from '../constants/MainConstant';
import Colors from '../assets/colors/colors';

const CustomDropdown = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    options?.find(option => option.value === value)?.label || placeholder;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.inputText, !value && { color: Colors.grey }]}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={modalVisible} transparent animationType={SLIDE_ANIMATION}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder}</Text>

            <ScrollView style={styles.optionList}>
              {options?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionItem}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText} adjustsFontSizeToFit={true}>{CLOSE_TXT}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

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
  inputBox: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 6,
    padding: 12,
  },
  inputText: {
    fontSize: 16,
    color: Colors.black,
  },
  error: {
    color: Colors.red_1,
    marginTop: 4,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionList: {
    marginVertical: 10,
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeText: {
    color: Colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

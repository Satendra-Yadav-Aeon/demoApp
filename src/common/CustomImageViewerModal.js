// components/CustomImageViewerModal.js

import React from 'react';
import { Modal, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import MyImages from '../utils/MyImages';
import Colors from '../assets/colors/colors';

const CustomImageViewerModal = ({ visible, onClose, imageUri }) => {
  if (!imageUri) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={MyImages.close} style={styles.closeIcon} />
        </TouchableOpacity>
        <ImageViewer
          imageUrls={[{ url: imageUri }]}
          renderIndicator={() => null}
          renderFooter={() => null}
          style={styles.fullScreenImage}
        />
      </View>
    </Modal>
  );
};

export default CustomImageViewerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeIcon: {
    width: 40,
    height: 40,
    tintColor: Colors.red_1,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

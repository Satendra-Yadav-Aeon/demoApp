import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MyImages from '../../../utils/MyImages';
import Colors from '../../../assets/colors/colors';
import { formatTime } from '../../../utils/formatDateUtils';
import { NotificationContext } from '../context/NotificationContext';
import { NOTIFICATION_CONSTANT } from '../constants/DashboardConstant';


const NotificationScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation()
  const { notifications, markAsRead, markAllAsRead } = useContext(NotificationContext);

  const renderItem = ({ item }) => {
    const id = `${item.empid}_${item.checkdate}`;
    const status = item.inout === "1" ? 'IN' : 'OUT';
    const whoMarked = item.attendanceBy === 'Self' ? t('by_self') : t('by_supervisor');
    const message = t('notification.outside_check', {
      name: item.empname,
      status,
      location: item.locationName,
      time: formatTime(item.checkdate),
      who: whoMarked
    });

    return (
      <TouchableOpacity
        onPress={() => markAsRead(id)}
        style={[styles.item, item.isRead ? styles.read : styles.unread]}
      >
        <Text style={styles.msgText}>{message}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={MyImages.goBack} style={styles.goBackIcon}/>
        </TouchableOpacity>
        <Text style={styles.heading}>{t(NOTIFICATION_CONSTANT.NOTIFICATION_TITLE)}</Text>
      </View>
      <TouchableOpacity onPress={markAllAsRead} style={styles.button}>
        <Text style={styles.buttonText}>{t(NOTIFICATION_CONSTANT.MARK_ALL_READ)}</Text>
      </TouchableOpacity>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.empid}_${item.checkdate}_${i}`}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15,
    backgroundColor: Colors.white 
  },
  item: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 2,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.red,
    marginBottom: 10,
    marginLeft: 10,
    textAlign: 'center',
  },
  unread: {
    borderColor: Colors.red_1,
    backgroundColor: Colors.bgColor,
    borderWidth: 2
  },
  read: {
    borderColor: Colors.grey,
    backgroundColor: Colors.white,
    borderWidth: 2
  },
  button: {
    backgroundColor: Colors.red,
    padding: 10,
    alignSelf: 'flex-end',
    borderRadius: 6,
    marginBottom: 50,
    marginTop: 30
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500'
  },
  goBackIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.red,
    marginLeft: 10,
  },
  msgText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '400'
  }
});

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BottomTaskBar = ({ navigation, currentClassName }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('GeneralChatScreen', { className: currentClassName })}>
        <Image source={require('../../assets/chat_icon.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
        <Image source={require('../../assets/meeting.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AssignmentsScreen', { className: currentClassName })}>
        <Image source={require('../../assets/assignments.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Marks')}>
        <Image source={require('../../assets/marks.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});

export default BottomTaskBar;
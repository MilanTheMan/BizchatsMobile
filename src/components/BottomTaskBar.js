import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BottomTaskBar = ({ navigation, currentClassName, currentClassId }) => {
  return (
    <View style={styles.container}>
      {/* 🟦 General Chat */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('GeneralChatScreen', {
            className: currentClassName,
            channelId: currentClassId,
          })
        }
      >
        <Image source={require('../../assets/chat_icon.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* 👥 Friends */}
      <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
        <Image source={require('../../assets/meeting.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* 📘 Assignments */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AssignmentsScreen', {
            className: currentClassName,
            channelId: currentClassId, // ✅ Required by mobile screen
          })
        }
      >
        <Image source={require('../../assets/assignments.png')} style={styles.icon} />
      </TouchableOpacity>

      {/* 🎯 Marks/Grades */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Marks', {
            className: currentClassName,
            channelId: currentClassId,
          })
        }
      >
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

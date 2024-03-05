import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

const SettingsScreen = () => {
  const [timerDuration, setTimerDuration] = useState('1'); // Default to 1 minute

  useEffect(() => {
    loadTimerDuration();
  }, []);

  const saveTimerDuration = async (newValue) => {
    try {
      await AsyncStorage.setItem('@stay_timer_duration', newValue);
      setTimerDuration(newValue);
    } catch (e) {
      console.log(e);
    }
  };

  const loadTimerDuration = async () => {
    try {
      const value = await AsyncStorage.getItem('@stay_timer_duration');
      if(value !== null) {
        setTimerDuration(value);
      }
    } catch(e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select timer duration (minutes):</Text>
      <Picker
        selectedValue={timerDuration}
        onValueChange={(itemValue, itemIndex) => saveTimerDuration(itemValue)}
        style={styles.picker}>
        <Picker.Item label="1 minute" value="1" />
        <Picker.Item label="2 minutes" value="2" />
        {/* Add more options as needed */}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default SettingsScreen;

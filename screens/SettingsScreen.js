import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

const SettingsScreen = () => {
  const [timerDuration, setTimerDuration] = useState('1'); 
  const [inputDuration, setInputDuration] = useState('');

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
  const saveInputDuration = async () => {
    try {
      const time = inputDuration.trim();
      if (!time) {
        Alert.alert("Please enter a valid number.");
        Keyboard.dismiss();
        return;
      }
      await AsyncStorage.setItem('@stay_timer_duration', time);
      setTimerDuration(time);
      setInputDuration('');
      Keyboard.dismiss();
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
      <TextInput
        style={styles.input}
        onChangeText={setInputDuration}
        value={inputDuration}
        placeholder="Enter custom duration (minutes)"
        keyboardType="numeric"
      />
      <Button title="Save Duration" onPress={saveInputDuration} />
      <Picker
        selectedValue={timerDuration}
        onValueChange={(itemValue, itemIndex) => saveTimerDuration(itemValue)}
        style={styles.picker}>
        <Picker.Item label="1 minute" value="1" />
        <Picker.Item label="2 minutes" value="2" />
        <Picker.Item label="3 minutes" value="3" />
        <Picker.Item label="4 minutes" value="4" />
        <Picker.Item label="5 minutes" value="5" />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200
  },
});

export default SettingsScreen;

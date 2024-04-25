import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Linking, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DisclaimerScreen = ({ navigation }) => {
  const checkDisclaimerAccepted = async () => {
    const disclaimerAccepted = await AsyncStorage.getItem('disclaimerAccepted');
    if (disclaimerAccepted === 'true') {
      navigation.navigate('Welcome');
    }
  };

  useEffect(() => {
    checkDisclaimerAccepted();
  }, []);

  const handleAccept = async () => {
    await AsyncStorage.setItem('disclaimerAccepted', 'true');
    navigation.navigate('Welcome');
  };

  const handleDecline = () => {
    Alert.alert(
        'Disclaimer Required',
        'You must accept the disclaimer to use this app.',
        [{ text: 'OK' }]
      );
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Please read and accept the disclaimer to continue.</Text>
      <Pressable
          onPress={() => Linking.openURL('https://origins-source.com/account-page/assets/terms.pdf')}
      >
          <Text style={{
              fontSize: 16,
              color: 'red',
              fontWeight: "bold",
              marginLeft: 6
          }}>Terms and Conditions</Text>
      </Pressable>
      <Button title="I Agree" onPress={handleAccept} />
      <Button title="I Decline" onPress={handleDecline} />
    </View>
  );
};

export default DisclaimerScreen;

import React, { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function Splash({setIsLoading}) {
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false); // Use the function to update the state
      }, 1600); // Adjust the timeout as needed
  
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <View style={{flex:1, alignItems: 'center', margin: 0}}>
      <LottieView
        autoPlay
        style={{
          flex: 1,
          width:width,
          height:height,
          backgroundColor: 'transparent',
        }}
        source={require('../assets/waveloading.json')}
      />
    </View>
  );
}

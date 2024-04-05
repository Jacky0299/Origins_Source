import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
const ComingSoonScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.text}>Coming Soon</Text>
        </View>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5D3FD3',
    },
    wrapper: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
  export default ComingSoonScreen;
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ScrollView  } from 'react-native';
import * as Location from 'expo-location';
import Checkbox from 'expo-checkbox';

const TravelTrackerScreen = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const lastLocationRef = useRef(null);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Locked Doors", checked: false },
    { id: 2, text: "Turned Off Oven", checked: false },
    { id: 3, text: "Windows Closed", checked: false },
    { id: 4, text: "Water Plants", checked: false },
  ]);
  
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    setIsTracking(true);
    const sub = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
    }, (location) => {
      const newLocation = location.coords;
      updateDistance(newLocation);
      lastLocationRef.current = newLocation;
    });

    setSubscription(sub);
  };

  const clearDistance = () => {
    setDistanceTraveled(0);
  };

  const updateDistance = (newLocation) => {
    if (lastLocationRef.current) {
      const distance = getDistance(
        newLocation.latitude,
        newLocation.longitude,
        lastLocationRef.current.latitude,
        lastLocationRef.current.longitude
      );
      setDistanceTraveled(prevDistance => prevDistance + distance);
    }
  };
  const toggleChecklistItem = (id) => {
    setChecklist(currentList =>
      currentList.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  useEffect(() => {
    return () => {
      subscription?.remove();
    };
  }, [subscription]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Distance Traveled: {distanceTraveled.toFixed(2)} meters</Text>
        {!isTracking && (
          <Button
            title="Start Tracking"
            onPress={startTracking}
          />
        )}
        {isTracking && (
          <Button
            title="Clear Distance"
            onPress={clearDistance}
          />
        )}
        <Text style={styles.title}>Pre-Travel Checklist</Text>
        {checklist.map(item => (
          <View key={item.id} style={styles.listItem}>
            <Checkbox
              value={item.checked}
              onValueChange={() => toggleChecklistItem(item.id)}
              color={item.checked ? '#4630EB' : undefined}
            />
            <Text style={styles.itemText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TravelTrackerScreen;

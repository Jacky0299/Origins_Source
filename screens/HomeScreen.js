import React, { useEffect, useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const timerRef = useRef(null);
  const lastPositionRef = useRef(null);
  const mapRef = useRef(null);
  const [timerDuration, setTimerDuration] = useState(60000);

  const checkPositionChange = (newLocation) => {
    const { latitude, longitude } = newLocation.coords;
    const lastPosition = lastPositionRef.current;

    if (!lastPosition) {
      lastPositionRef.current = { latitude, longitude };
      setPath(currentPath => [...currentPath, { latitude, longitude }]);
      console.log("no movement");
      return false; // No last position to compare, so no movement
    }

    const distance = getDistance(
      latitude,
      longitude,
      lastPosition.latitude,
      lastPosition.longitude
    );

    // Check if distance moved is significant, more than 10 meters
    if (distance > 10) {
      lastPositionRef.current = { latitude, longitude };
      setPath(currentPath => [...currentPath, { latitude, longitude }]);
      console.log("changed");
      return true;
    }
    console.log("not changed");
    return false;
  };

  // Function to calculate distance between two coordinates in meters
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
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

  useEffect(() => {
    async function watchPosition() {
      const durationValue = await AsyncStorage.getItem('@stay_timer_duration');
      if (durationValue !== null) {
        setTimerDuration(parseInt(durationValue) * 60000); // Convert minutes to milliseconds
      }
      console.log(durationValue);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (newLocation) => {
          if (checkPositionChange(newLocation)) {
            // If there's significant movement, reset the timer
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
          } else {
            console.log("im not changing");
            startStayTimer();
          }

          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.0092,
            longitudeDelta: 0.0061,
          });
          mapRef.current?.animateToRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.0092,
            longitudeDelta: 0.0061,
          }, 1000);
        }
      );
    }
    console.log(timerDuration);
    const startStayTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        Alert.alert("Alert", `You've stayed in the same position for ${timerDuration / 60000} minute(s).`);
      }, timerDuration);
    };
    watchPosition();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          showsUserLocation={true}
        >
          <Polyline
            coordinates={path}
            strokeColor="#000" // black
            strokeWidth={6}
          />
        </MapView>
      )}
    </View>
  );
}

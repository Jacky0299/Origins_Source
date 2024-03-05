import React, { useEffect, useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]); // Store the path as an array of coordinates
  const timerRef = useRef(null);
  const lastPositionRef = useRef(null);

  const checkPositionChange = (newLocation) => {
    const { latitude, longitude } = newLocation.coords;
    const lastPosition = lastPositionRef.current;

    if (!lastPosition) {
      lastPositionRef.current = { latitude, longitude };
      setPath(currentPath => [...currentPath, { latitude, longitude }]);
      return false; // No last position to compare, so no movement
    }

    const distance = getDistance(
      latitude,
      longitude,
      lastPosition.latitude,
      lastPosition.longitude
    );

    if (distance > 10) {
      lastPositionRef.current = { latitude, longitude };
      setPath(currentPath => [...currentPath, { latitude, longitude }]);
      return true;
    }

    return false;
  };

  // Function to calculate distance between two coordinates in meters remains the same

  useEffect(() => {
    async function watchPosition() {
      await Location.requestPermissionsAsync();

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (newLocation) => {
          if (checkPositionChange(newLocation)) {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            startStayTimer();
          }

          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      );
    }

    const startStayTimer = () => {
      timerRef.current = setTimeout(() => {
        Alert.alert("Alert", "You've stayed in the same position for 1 minute.");
      }, 60000); // Corrected to 1 minute
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
          style={{ flex: 1 }}
          initialRegion={location}
          showsUserLocation={true}
        >
          <Marker coordinate={location} />
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

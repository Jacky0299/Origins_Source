import React, { useEffect, useState, useRef } from 'react';
import { View, Alert , StyleSheet, Text, Button, Modal, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const timerRef = useRef(null);
  const lastPositionRef = useRef(null);
  const mapRef = useRef(null);
  const [timerDuration, setTimerDuration] = useState(60000);
  // Something learned: React state updates are asynchronous. 
  // React schedules the update and proceeds to the next lines of code without waiting for the state to actually change. 
  // Consequently, if you console log something immediately after setting it, you still see the old state.
  // That's why I did this:
  const [centerPoint, setCenterPoint] = useState(null);
  const centerPointRef = useRef(centerPoint);
  useEffect(() => {
    centerPointRef.current = centerPoint;
  }, [centerPoint]);

  const [radius, setRadius] = useState(100);
  const radiusRef = useRef(radius);
  useEffect(() => {
    radiusRef.current = radius;
  }, [radius]);

  const handleMapLongPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCenterPoint({ latitude, longitude });
    setRadius(100);
  };

  const handleSetCenterPoint = () => {
    if (location) {
      setCenterPoint({ latitude: location.latitude, longitude: location.longitude });
      Alert.alert("Center Point Set", "The center point has been updated to your current location.");
    } else {
      Alert.alert("Location Not Found", "Current location is unavailable.");
    }
  };

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
  const checkIfOutsideRadius = (newLocation) => {
    if (centerPointRef.current != null){
      const distance = getDistance(
        newLocation.coords.latitude,
        newLocation.coords.longitude,
        centerPointRef.current.latitude,
        centerPointRef.current.longitude
      );
      if (distance > radiusRef.current) {
        Alert.alert("You've left the designated area.");
      }
    }
  };

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
            checkIfOutsideRadius(newLocation);
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
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          onLongPress={handleMapLongPress}
        >
          <Polyline
            coordinates={path}
            strokeColor="#000"
            strokeWidth={6}
          />
          {/* Optionally display the center point */}
          {centerPoint && (
      <>
        <Marker coordinate={centerPoint} title="Center Point" />
        <Circle
          center={centerPoint}
          radius={radius}
          fillColor="rgba(100, 100, 200, 0.5)"
          strokeColor="rgba(0, 0, 200, 1)"
          strokeWidth={2}
        />
      </>
    )}
        </MapView>
      )}
        <TouchableOpacity style={styles.iconPosition} onPress={() => setModalVisible(true)}>
          <Ionicons name="disc-outline" size={24} />
        </TouchableOpacity>
      
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Radius: {radius} meters</Text>
            <Text style={{ fontSize: 12 }}>Hold onto the screen to get the radius you want</Text>
            <Button title="Increase Radius" onPress={() => setRadius(radius + 100)} />
            <Button title="Decrease Radius" onPress={() => radius >= 100 ? setRadius(radius - 50) : null} />
            <Button title="Set Center Point" onPress={handleSetCenterPoint} />
            <Button title="Clear" onPress={() => setRadius(null)} />
            <Button title="Close" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconPosition: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 10,
  },
});


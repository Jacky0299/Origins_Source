import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function DetailsScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [radius, setRadius] = useState(100); // Default radius 100 meters
    const [hasLeftRadius, setHasLeftRadius] = useState(false);
    const [customLocation, setCustomLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);
    const toRadians = (degree) => degree * (Math.PI / 180);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = toRadians(lat1);
        const φ2 = toRadians(lat2);
        const Δφ = toRadians(lat2 - lat1);
        const Δλ = toRadians(lon2 - lon1);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance;
    };
    const checkIfOutsideRadius = (newLocation) => {
        const center = customLocation || location.coords;
        const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            newLocation.coords.latitude,
            newLocation.coords.longitude
        );

        if (distance > radius && !hasLeftRadius) {
            Alert.alert("You've left the designated area!");
            setHasLeftRadius(true);
        } else if (distance <= radius && hasLeftRadius) {
            setHasLeftRadius(false);
        }
    };

    useEffect(() => {
        if (!location) return;
        const watcher = Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 1, // receives updates only when location changes
            },
            (newLocation) => {
                checkIfOutsideRadius(newLocation);
            }
        );

        return () => {
            watcher.then(sub => sub.remove());
        };
    }, [location, radius]);

    return (
        <View style={{ flex: 1 }}>
            {location && (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0092,
                        longitudeDelta: 0.0061,
                    }}
                    onLongPress={(e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate;
                        setCustomLocation({ latitude, longitude });
                        setHasLeftRadius(false); // Optionally reset this as well
                    }}
                >
                    {(customLocation || location) && (
                        <>
                            <Marker
                                coordinate={customLocation || location.coords}
                            />
                            <Circle
                                center={customLocation || location.coords}
                                radius={radius}
                                strokeColor="rgba(158, 158, 255, 1.0)"
                                fillColor="rgba(158, 158, 255, 0.3)"
                            />
                        </>
                    )}
                </MapView>
            )}
            <Button title="Increase Radius" onPress={() => setRadius(radius + 100)} />
            <Button title="Decrease Radius" onPress={() => setRadius(radius - 100)} />
            <Button title="Reset Circle" onPress={() => {
                setCustomLocation(null);
                setHasLeftRadius(false);
            }} />
        </View>
    );
}

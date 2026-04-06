import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const DEVICE_LOCATIONS = {
  1: { latitude: 6.8935, longitude: 79.9612 },  // Sri Jayewardenepura Kotte
  2: { latitude: 7.2906, longitude: 80.6337 },   // Kandy
};

export default function MapSection({ deviceId = 1 }) {
  const deviceLocation = DEVICE_LOCATIONS[deviceId] || DEVICE_LOCATIONS[1];
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (e) {
        setError('Could not get location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2D4F7C" />
        <Text style={styles.loadingText}>Getting location...</Text>
      </View>
    );
  }

  const mapCenter = currentLocation || deviceLocation;

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={true}
      followsUserLocation={true}
      initialRegion={{
        latitude: mapCenter.latitude,
        longitude: mapCenter.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* Device marker */}
      <Marker coordinate={deviceLocation} title={`DEVICE 0${deviceId}`} description={deviceId === 1 ? 'Fire Detected!' : 'All Clear'}>
        <Text style={{ fontSize: 28 }}>{deviceId === 1 ? '🔥' : '📡'}</Text>
      </Marker>

      {/* Current location marker */}
      {currentLocation && (
        <Marker coordinate={currentLocation} title="Your Location" description="You are here">
          <View style={styles.myMarker}>
            <View style={styles.myMarkerDot} />
          </View>
        </Marker>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  loading: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: '#d0e8d0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#555',
    fontSize: 13,
  },
  myMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 79, 124, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2D4F7C',
  },
  myMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D4F7C',
  },
});

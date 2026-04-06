import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const DEVICE_LOCATIONS = {
  1: { lat: 6.8935, lng: 79.9612 },
  2: { lat: 7.2906, lng: 80.6337 },
};

export default function MapSection({ deviceId = 1 }) {
  const deviceLocation = DEVICE_LOCATIONS[deviceId] || DEVICE_LOCATIONS[1];
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => {
          setLocation(FIRE_LOCATION);
          setLoading(false);
        },
        { timeout: 8000 }
      );
    } else {
      setLocation(FIRE_LOCATION);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2D4F7C" />
        <Text style={styles.loadingText}>Getting location...</Text>
      </View>
    );
  }

  const center = location || deviceLocation;
  const src = `https://maps.google.com/maps?q=${center.lat},${center.lng}&z=14&output=embed`;

  return (
    <View style={styles.container}>
      <iframe
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
        allowFullScreen
        loading="lazy"
        title="Map"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
    backgroundColor: '#d0e8d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#555',
    fontSize: 13,
    marginTop: 8,
  },
});

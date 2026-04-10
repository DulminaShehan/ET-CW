import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Camera only loads on native
let CameraView, useCameraPermissions;
if (Platform.OS !== 'web') {
  const Cam = require('expo-camera');
  CameraView = Cam.CameraView;
  useCameraPermissions = Cam.useCameraPermissions;
}

const DEVICE_DATA = {
  1: { name: 'DEVICE 01', temp: '31.7', humidity: '65.4%', smoke: '0', co: '7', lat: '6.8935°N', lng: '79.9612°E', status: 'FIRE' },
  2: { name: 'DEVICE 02', temp: '28.3', humidity: '72.1%', smoke: '2', co: '3', lat: '7.2906°N', lng: '80.6337°E', status: 'SAFE' },
};

export default function ARCameraScreen({ navigation, route }) {
  const deviceId = route?.params?.deviceId || 1;
  const device = DEVICE_DATA[deviceId];

  const [permission, requestPermission] = Platform.OS !== 'web'
    ? useCameraPermissions()
    : [{ granted: false }, () => {}];

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for fire alert
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.webCamSim}>
          <Text style={styles.webCamText}>📷 Camera (Native Only)</Text>
        </View>
        <AROverlay device={device} pulseAnim={pulseAnim} scanTranslateY={scanTranslateY} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={60} color="#fff" />
        <Text style={styles.permissionText}>Camera access is needed for AR fire detection</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtnSimple} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnSimpleText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <CameraView style={styles.camera} facing="back">
        <AROverlay device={device} pulseAnim={pulseAnim} scanTranslateY={scanTranslateY} />
      </CameraView>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function AROverlay({ device, pulseAnim, scanTranslateY }) {
  const isFire = device.status === 'FIRE';

  return (
    <View style={styles.overlay}>
      {/* Top Header */}
      <View style={styles.arHeader}>
        <View style={styles.arHeaderLeft}>
          <Ionicons name="flame" size={18} color="#E05252" />
          <Text style={styles.arHeaderTitle}>FireGuard AR</Text>
        </View>
        <Text style={styles.arHeaderDevice}>{device.name}</Text>
      </View>

      {/* Scan line */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanTranslateY }] }]} />

      {/* Corner brackets */}
      <View style={styles.bracketTL} /><View style={styles.bracketTR} />
      <View style={styles.bracketBL} /><View style={styles.bracketBR} />

      {/* Center fire alert */}
      {isFire && (
        <Animated.View style={[styles.fireAlertCenter, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={styles.fireAlertText}>FIRE DETECTED</Text>
          <Text style={styles.fireAlertSub}>Immediate Action Required</Text>
        </Animated.View>
      )}

      {/* Data panels */}
      <View style={styles.dataPanel}>
        <Text style={styles.dataPanelTitle}>SENSOR READINGS</Text>
        <DataRow icon="thermometer" label="Temperature" value={`${device.temp}°C`} alert={parseFloat(device.temp) > 30} />
        <DataRow icon="water-percent" label="Humidity" value={device.humidity} />
        <DataRow icon="weather-windy" label="Smoke (MQ-2)" value={device.smoke} alert={parseInt(device.smoke) > 5} />
        <DataRow icon="cloud" label="CO (MQ-9)" value={device.co} alert={parseInt(device.co) > 10} />
      </View>

      {/* GPS panel */}
      <View style={styles.gpsPanel}>
        <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#4CAF50" />
        <Text style={styles.gpsPanelText}>{device.lat}  {device.lng}</Text>
      </View>

      {/* Status badge */}
      <View style={[styles.statusBadge, { backgroundColor: isFire ? '#E05252' : '#4CAF50' }]}>
        <Text style={styles.statusBadgeText}>{isFire ? '🔥 FIRE ALERT' : '✅ ALL CLEAR'}</Text>
      </View>
    </View>
  );
}

function DataRow({ icon, label, value, alert = false }) {
  return (
    <View style={styles.dataRow}>
      <MaterialCommunityIcons name={icon} size={14} color={alert ? '#E05252' : '#4CAF50'} />
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, alert && styles.dataValueAlert]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  webFallback: { flex: 1, backgroundColor: '#111' },
  webCamSim: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webCamText: { color: '#555', fontSize: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
  },
  arHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  arHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arHeaderTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  arHeaderDevice: { color: '#4CAF50', fontWeight: '700', fontSize: 13 },

  scanLine: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 60,
    height: 2,
    backgroundColor: 'rgba(224, 82, 82, 0.7)',
    shadowColor: '#E05252',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  // Corner brackets
  bracketTL: { position: 'absolute', top: 60, left: 16, width: 28, height: 28, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#E05252' },
  bracketTR: { position: 'absolute', top: 60, right: 16, width: 28, height: 28, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#E05252' },
  bracketBL: { position: 'absolute', bottom: 180, left: 16, width: 28, height: 28, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#E05252' },
  bracketBR: { position: 'absolute', bottom: 180, right: 16, width: 28, height: 28, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#E05252' },

  fireAlertCenter: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(224,82,82,0.25)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E05252',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  fireEmoji: { fontSize: 40 },
  fireAlertText: { color: '#fff', fontWeight: '900', fontSize: 20, letterSpacing: 2, marginTop: 4 },
  fireAlertSub: { color: '#ffccc', fontSize: 12, marginTop: 2, opacity: 0.9 },

  dataPanel: {
    position: 'absolute',
    bottom: 130,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dataPanelTitle: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dataLabel: { color: '#ccc', fontSize: 12, flex: 1 },
  dataValue: { color: '#4CAF50', fontSize: 13, fontWeight: '700' },
  dataValueAlert: { color: '#E05252' },

  gpsPanel: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 8,
  },
  gpsPanelText: { color: '#4CAF50', fontSize: 12, fontWeight: '600' },

  statusBadge: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  statusBadgeText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  permissionContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  permissionText: { color: '#ccc', textAlign: 'center', fontSize: 15, lineHeight: 22 },
  permissionBtn: {
    backgroundColor: '#2D4F7C',
    borderRadius: 25,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  permissionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  backBtnSimple: { marginTop: 8 },
  backBtnSimpleText: { color: '#E05252', fontSize: 14, fontWeight: '600' },
});

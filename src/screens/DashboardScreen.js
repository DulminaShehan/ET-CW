import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import MapSection from '../components/MapSection';

const DEVICES = {
  1: {
    name: 'DEVICE 01',
    status: 'FIRE',
    online: false,
    env: { temp: '31.7', humidity: '65.4%', rain: '0 %', rainLabel: 'No Rain' },
    gas: { smoke: { value: '0', label: 'safe' }, co: { value: '7', label: 'safe' }, fire: true },
    system: { battery: '100%', batteryV: '4.20V . Good', gpsStatus: 'Offline', satellites: '0 Satellites' },
    mapLabel: 'DEVICE 01 - FIRE LOCATION',
    flames: Array.from({ length: 10 }, (_, i) => ({ id: `S${i + 1}`, value: '??', label: 'No Data' })),
  },
  2: {
    name: 'DEVICE 02',
    status: 'SAFE',
    online: true,
    env: { temp: '28.3', humidity: '72.1%', rain: '12 %', rainLabel: 'Light Rain' },
    gas: { smoke: { value: '2', label: 'safe' }, co: { value: '3', label: 'safe' }, fire: false },
    system: { battery: '85%', batteryV: '4.10V . Good', gpsStatus: 'Online', satellites: '8 Satellites' },
    mapLabel: 'DEVICE 02 - CURRENT LOCATION',
    flames: Array.from({ length: 10 }, (_, i) => ({
      id: `S${i + 1}`,
      value: i < 3 ? `${i * 5}` : '0',
      label: i < 3 ? 'Low' : 'Safe',
    })),
  },
};

export default function DashboardScreen({ navigation, route }) {
  const [activeDevice, setActiveDevice] = useState(1);
  const device = DEVICES[activeDevice];
  const role = route?.params?.role || 'officer';
  const isHiker = role === 'hiker';
  const [muted, setMuted] = useState(false);
  const soundRef = useRef(null);

  // Play alarm when fire detected and not muted
  useEffect(() => {
    const isFire = device.status === 'FIRE';

    const playAlarm = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://www.soundjay.com/misc/sounds/fail-buzzer-04.mp3' },
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        soundRef.current = sound;
      } catch (e) {
        console.log('Sound error:', e);
      }
    };

    const stopAlarm = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      } catch (e) {}
    };

    if (isFire && !muted) {
      playAlarm();
    } else {
      stopAlarm();
    }

    return () => { stopAlarm(); };
  }, [device.status, muted]);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  return (
    <View style={styles.outer}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="flame" size={22} color="#E05252" />
          <Text style={styles.headerTitle}>Forest Fire Monitor</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.officerBadge}>
            <Ionicons name={isHiker ? 'walk' : 'person'} size={14} color="#333" />
            <Text style={styles.officerText}>{isHiker ? 'Hiker' : 'Officer'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Device Tabs — visible to all */}
      <View style={styles.tabRow}>
        {[1, 2].map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.tab, activeDevice === d && styles.tabActive]}
            onPress={() => setActiveDevice(d)}
          >
            <Ionicons name="radio" size={14} color={activeDevice === d ? '#fff' : '#555'} />
            <Text style={[styles.tabText, activeDevice === d && styles.tabTextActive]}>
              DEVICE 0{d}
            </Text>
            <View style={[
              styles.tabDot,
              { backgroundColor: DEVICES[d].online ? '#4CAF50' : '#E05252' },
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Fire Alert Banner — visible to ALL users */}
      {device.status === 'FIRE' && (
        <View style={styles.alertBanner}>
          <Ionicons name="flame" size={20} color="#fff" />
          <View style={styles.alertBannerText}>
            <Text style={styles.alertBannerTitle}>🔥 FIRE DETECTED — {device.name}</Text>
            <Text style={styles.alertBannerSub}>Evacuate immediately. Emergency services notified.</Text>
          </View>
          <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.alertMuteBtn}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Device Status */}
        {!isHiker && (
          <View style={styles.deviceRow}>
            <Ionicons name="radio" size={18} color="#333" />
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: device.status === 'FIRE' ? '#E05252' : '#4CAF50' }]}>
              <Ionicons name={device.status === 'FIRE' ? 'flame' : 'checkmark-circle'} size={12} color="#fff" />
              <Text style={styles.statusBadgeText}>{device.status}</Text>
            </View>
            <View style={[styles.onlineDot, { backgroundColor: device.online ? '#4CAF50' : '#E05252' }]} />
            <Text style={styles.onlineText}>{device.online ? 'Online' : 'Offline'}</Text>
          </View>
        )}

        {/* Environment Section */}
        <Text style={styles.sectionTitle}>ENVIRONMENT</Text>
        <View style={styles.cardRow}>
          <SensorCard
            icon={<MaterialCommunityIcons name="thermometer" size={28} color="#E05252" />}
            label="TEMP"
            sublabel="Celsius"
            value={device.env.temp}
            color="#A8E6A3"
          />
          <SensorCard
            icon={<MaterialCommunityIcons name="water-percent" size={28} color="#5B9BD5" />}
            label="HUMIDITY"
            value={device.env.humidity}
            color="#A8E6A3"
          />
          <SensorCard
            icon={<Ionicons name="cloud" size={28} color="#7E9CB5" />}
            label="RAIN"
            value={device.env.rain}
            sublabel={device.env.rainLabel}
            color="#A8E6A3"
          />
        </View>

        {/* Gas Sensors — Officer only */}
        {!isHiker && (
          <>
            <Text style={styles.sectionTitle}>GAS SENSORS</Text>
            <View style={styles.cardRow}>
              <SensorCard
                icon={<MaterialCommunityIcons name="weather-windy" size={28} color="#555" />}
                label="MQ-2 SMOKE"
                value={device.gas.smoke.value}
                sublabel={device.gas.smoke.label}
                color="#A8E6A3"
              />
              <SensorCard
                icon={<Ionicons name="cloud" size={28} color="#7E9CB5" />}
                label="MQ-9 CO"
                value={device.gas.co.value}
                sublabel={device.gas.co.label}
                color="#A8E6A3"
              />
              <SensorCard
                icon={<Ionicons name="flame" size={28} color={device.gas.fire ? '#fff' : '#4CAF50'} />}
                label="FLAME"
                value={device.gas.fire ? 'FIRE!' : 'Safe'}
                sublabel="flame sensor"
                color={device.gas.fire ? '#E05252' : '#A8E6A3'}
                textColor={device.gas.fire ? '#fff' : '#1a1a1a'}
              />
            </View>
          </>
        )}

        {/* System — GPS shown to all, Battery officer only */}
        <Text style={styles.sectionTitle}>SYSTEM</Text>
        <View style={styles.cardRowHalf}>
          {!isHiker && (
            <SensorCard
              icon={<MaterialCommunityIcons name="battery-charging-100" size={28} color="#4CAF50" />}
              label="BATTERY"
              value={device.system.battery}
              sublabel={device.system.batteryV}
              color="#A8E6A3"
            />
          )}
          <SensorCard
            icon={<MaterialCommunityIcons name="crosshairs-gps" size={28} color={device.online ? '#4CAF50' : '#E05252'} />}
            label="GPS"
            value={device.system.gpsStatus}
            sublabel={device.system.satellites}
            color="#A8E6A3"
          />
          <View style={{ flex: 1 }} />
        </View>

        {/* Map */}
        <MapSection deviceId={activeDevice} />
        <View style={styles.mapLabelRow}>
          <View style={styles.mapLabel}>
            <Text style={styles.mapLabelText}>{device.mapLabel}</Text>
          </View>
          {/* AR Camera button — Officer only, fire detected */}
          {!isHiker && device.status === 'FIRE' && (
            <TouchableOpacity
              style={styles.arButton}
              onPress={() => navigation.navigate('ARCamera', { deviceId: activeDevice })}
              activeOpacity={0.85}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Flame Sensors — Officer only */}
        {!isHiker && (
          <>
            <Text style={styles.sectionTitle}>FLAME SENSORS - 10 ZONES</Text>
            <View style={styles.flameGrid}>
              {device.flames.map((sensor) => (
                <View
                  key={sensor.id}
                  style={[styles.flameCard, { backgroundColor: sensor.label === 'Safe' ? '#4CAF50' : sensor.label === 'No Data' ? '#E05252' : '#F4A030' }]}
                >
                  <Text style={styles.flameId}>{sensor.id}</Text>
                  <Text style={styles.flameValue}>{sensor.value}</Text>
                  <Text style={styles.flameLabel}>{sensor.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function SensorCard({ icon, label, value, sublabel, color, textColor = '#1a1a1a' }) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      {icon}
      <Text style={[styles.cardLabel, { color: textColor }]}>{label}</Text>
      <Text style={[styles.cardValue, { color: textColor }]}>{value}</Text>
      {sublabel ? <Text style={[styles.cardSub, { color: textColor }]}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#FAF9E4',
    borderWidth: 8,
    borderColor: '#F4A7A7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  officerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  officerText: {
    fontSize: 12,
    color: '#333',
  },
  logoutText: {
    fontSize: 13,
    color: '#E05252',
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: '#2D4F7C',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 30,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineText: {
    fontSize: 13,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#555',
    marginTop: 10,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cardRowHalf: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  cardSub: {
    fontSize: 10,
    marginTop: 1,
    textAlign: 'center',
  },
  mapLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 4,
  },
  mapLabel: {
    backgroundColor: '#E05252',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  mapLabelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E05252',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  alertBannerText: {
    flex: 1,
  },
  alertBannerTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  alertBannerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  alertMuteBtn: {
    padding: 4,
  },
  muteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E05252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteBtnActive: {
    borderColor: '#ccc',
  },
  arButton: {
    backgroundColor: '#2D4F7C',
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flameCard: {
    width: '18%',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  flameId: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  flameValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  flameLabel: {
    color: '#fff',
    fontSize: 9,
    textAlign: 'center',
  },
});

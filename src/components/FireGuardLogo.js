import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

export default function FireGuardLogo({ size = 120 }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        {/* Outer circle */}
        <Circle cx="60" cy="60" r="55" fill="#fff" stroke="#1a1a1a" strokeWidth="3" />

        {/* Flame - red/orange */}
        <Path
          d="M60 15 C60 15 80 35 80 55 C80 70 70 80 60 80 C50 80 40 70 40 55 C40 35 60 15 60 15Z"
          fill="#E05252"
        />
        {/* Inner flame */}
        <Path
          d="M60 30 C60 30 72 45 72 58 C72 68 67 75 60 75 C53 75 48 68 48 58 C48 45 60 30 60 30Z"
          fill="#F4A7A7"
        />

        {/* Tree trunk */}
        <Path d="M56 65 L56 80 L64 80 L64 65 Z" fill="#2D4F7C" />
        {/* Tree top left */}
        <Path d="M60 48 L48 68 L72 68 Z" fill="#2D4F7C" />
        {/* Tree top middle */}
        <Path d="M60 40 L50 62 L70 62 Z" fill="#2D4F7C" />

        {/* Bottom arc */}
        <Path
          d="M28 90 Q60 108 92 90"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

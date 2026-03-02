import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number; 
}

const GlassCard = ({ children, style, intensity = 0.7 }: GlassCardProps) => {
  return (
    <View style={[
      styles.glass, 
      { backgroundColor: `rgba(255, 255, 255, ${intensity})` }, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glass: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)', 
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default GlassCard;
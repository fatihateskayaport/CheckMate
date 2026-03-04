import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export const WeatherOverlay = ({ condition }: { condition: string | undefined }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const moveAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.sequence([
      // Daha yavaş ve zarif belirme
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.parallel([
        // Daha uzun süzülme süresi (6s)
        Animated.timing(moveAnim, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(4000), // Ekranda daha uzun kalma
          Animated.timing(fadeAnim, { toValue: 0, duration: 2500, useNativeDriver: true }), // Yavaşça kaybolma
        ])
      ])
    ]).start();
  }, [fadeAnim, moveAnim]);

  const renderAnimation = () => {
    const cond = condition?.toLowerCase() || "";
    const isCloudy = cond.includes('bulut');
    const isSunny = cond.includes('güneş') || cond.includes('açık');
    const isRainy = cond.includes('yağmur');

    const baseColor = "rgba(148, 163, 184,"; 
    const sunColor = "rgba(253, 184, 19,";
    const rainColor = "rgba(99, 102, 241,"; 

    if (isCloudy) {
      return (
        <Animated.View style={[styles.animContainer, { 
          opacity: fadeAnim,
          transform: [{ translateX: moveAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 100] }) }] 
        }]}>
          {/* İrili Ufaklı Bulutlar (İyice Transparan) */}
          <MaterialCommunityIcons name="cloud" size={180} color={`${baseColor} 0.25)`} style={{ position: 'absolute', top: -140, left: -60 }} />
          <MaterialCommunityIcons name="cloud" size={110} color={`${baseColor} 0.2)`} style={{ position: 'absolute', top: -30, right: -70 }} />
          <MaterialCommunityIcons name="cloud" size={70} color={`${baseColor} 0.18)`} style={{ position: 'absolute', top: 90, left: -40 }} />
          <MaterialCommunityIcons name="cloud" size={50} color={`${baseColor} 0.15)`} style={{ position: 'absolute', bottom: -80, right: 30 }} />
          <MaterialCommunityIcons name="cloud" size={30} color={`${baseColor} 0.13)`} style={{ position: 'absolute', top: 150, left: -90 }} />
        </Animated.View>
      );
    }

if (isSunny) {
      return (
        <Animated.View style={[styles.animContainer, { 
          opacity: fadeAnim, 
          transform: [{ scale: moveAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] 
        }]}>         
          <View style={styles.minimalSun} />     
          <MaterialCommunityIcons 
            name="white-balance-sunny" 
            size={120} 
            color="rgba(253, 184, 19, 0.27)" 
          />
        </Animated.View>
      );
    }

    if (isRainy) {
      return (
        <Animated.View style={[styles.animContainer, { 
          opacity: fadeAnim,
          transform: [{ translateY: moveAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] }) }]
        }]}>
           <MaterialCommunityIcons name="weather-pouring" size={240} color={`${rainColor} 0.2)`} />
           <MaterialCommunityIcons name={"water" as any} size={30} color={`${rainColor} 0.25)`} style={{ position:'absolute', top: 100, left: -90 }} />
           <MaterialCommunityIcons name={"water" as any} size={20} color={`${rainColor} 0.2)`} style={{ position:'absolute', top: 170, right: -70 }} />
           <MaterialCommunityIcons name={"water" as any} size={15} color={`${rainColor} 0.16)`} style={{ position:'absolute', bottom: 30, left: -50 }} />
           <MaterialCommunityIcons name={"water" as any} size={10} color={`${rainColor} 0.14)`} style={{ position:'absolute', top: 220, right: -110 }} />
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <View style={styles.absoluteFull} pointerEvents="none">
      {renderAnimation()}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFull: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

minimalSun: {
    position: 'absolute',
    width: 400, // Çok geniş
    height: 400,
    borderRadius: 200,
    // Renk neredeyse transparan, sadece bir sıcaklık hissi
    backgroundColor: 'rgba(253, 184, 19, 0.04)', 

    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 100,
    elevation: 0, // Android'de sert gölgeyi engellemek için 0
  },
  animContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: width 
  },
});
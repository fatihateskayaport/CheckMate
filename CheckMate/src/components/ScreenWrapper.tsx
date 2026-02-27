import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: object;
};

const ScreenWrapper = ({ children, style }: Props) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 40000,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 40000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 30],
  });

  return (
    <LinearGradient
      colors={["#EEF2FF", "#E0E7FF", "#F5F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      <Animated.View
        style={[styles.blob1, { transform: [{ translateX }, { translateY }] }]}
      />
      <Animated.View
        style={[
          styles.blob2,
          {
            transform: [
              { translateX: Animated.multiply(translateX, -1) },
              { translateY },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blob3,
          {
            transform: [
              { translateX },
              { translateY: Animated.multiply(translateY, -1) },
            ],
          },
        ]}
      />
      {children}
    </LinearGradient>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  blob1: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(124, 255, 103, 0.12)",
    top: -80,
    right: -80,
  },
  blob2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(82, 39, 255, 0.10)",
    bottom: 80,
    left: -60,
  },
  blob3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(177, 158, 239, 0.12)",
    bottom: 300,
    right: 20,
  },
});

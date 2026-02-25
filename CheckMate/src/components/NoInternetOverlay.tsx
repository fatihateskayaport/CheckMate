import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const NoInternetOverlay = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [shouldRender, setShouldRender] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // KRİTİK: İnternet geldiğinde takılmayı önleyen sessiz kontrol
  const checkRealPing = async () => {
    try {
      const response = await fetch('https://1.1.1.1', { method: 'HEAD', cache: 'no-cache' });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isConnected) {
      setShouldRender(true);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      
      // SADECE cam açıkken çalışır, internet gelince durur
      if (!pollerRef.current) {
        pollerRef.current = setInterval(async () => {
          const online = await checkRealPing();
          if (online) setIsConnected(true);
        }, 3000);
      }
    } else {
      // İnternet geldiğinde her şeyi temizle
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isConnected]);

  useEffect(() => {
    const handleConnectivityChange = (state: NetInfoState) => {
      // Eğer kütüphane "bağlı değil" diyorsa hemen state'i güncelle
      if (state.isConnected === false) {
        setIsConnected(false);
      } 
      // Eğer kütüphane "bağlı" diyorsa ping ile teyit et
      else if (state.isConnected === true) {
        checkRealPing().then(online => setIsConnected(online));
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    return () => {
      unsubscribe();
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.absolute, { opacity: fadeAnim }]} pointerEvents="auto">
      <BlurView intensity={95} tint="light" style={styles.absolute}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="wifi-off" size={60} color="#6366F1" />
          </View>
          <Text style={styles.title}>Bağlantı Kesildi</Text>
          <Text style={styles.subtitle}>İnternet bağlantınızı kontrol edin.</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absolute: { ...StyleSheet.absoluteFillObject, zIndex: 99999, justifyContent: 'center', alignItems: 'center' },
  container: { alignItems: 'center', paddingHorizontal: 40 },
  iconContainer: { 
    backgroundColor: '#fff', padding: 20, borderRadius: 30, marginBottom: 20,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 
  },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
});

export default NoInternetOverlay;
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const SmartPanel = ({ data, isLoading, userName = "Fatih" }: { data: any, isLoading: boolean, userName?: string }) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#6366F1" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>


      <BlurView intensity={40} tint="light" style={styles.glassCard}>
        <View style={styles.cardRow}>
          <View style={styles.weatherSection}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons 
                name={data?.icon || 'weather-partly-cloudy'} 
                size={32} 
                color="#6366F1" 
              />
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.tempText}>{data?.temp ?? '--'}°C</Text>
              <Text style={styles.conditionText}>{data?.condition || 'Yükleniyor...'}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.taskSection}>
            <Text style={styles.dateLabel}>
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
            </Text>
            <Text style={styles.daySub}>
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}
            </Text>
          </View>
          
        </View>
      </BlurView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginBottom: 25, marginTop: 10 },
  textHeader: { marginBottom: 18 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  advice: { fontSize: 15, color: '#64748B', marginTop: 6, lineHeight: 22, fontStyle: 'italic', fontWeight: '500' },
  glassCard: {
    borderRadius: 30,
    padding: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.5)', 
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    // Hafif bir gölge efekti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weatherSection: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(99,102,241,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempText: { fontSize: 26, fontWeight: '900', color: '#1E293B' },
  conditionText: { fontSize: 13, color: '#475569', fontWeight: '700', textTransform: 'capitalize' },
  divider: { width: 1.5, height: 45, backgroundColor: 'rgba(99,102,241,0.1)' },
  taskSection: { alignItems: 'flex-end' },
  dateLabel: { fontSize: 18, fontWeight: '800', color: '#6366F1' },
  daySub: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  loadingContainer: { height: 160, justifyContent: 'center', alignItems: 'center' }
});
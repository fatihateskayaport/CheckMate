import { theme } from '@/src/constants';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export const WeeklyChart = ({ data }: { data: number[] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haftalık Performans 📊</Text>
      <LineChart
        data={{
          labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
          datasets: [{ data: data }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0, 
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, 
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.colors.primary
          }
        }}
        bezier 
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    marginLeft: 5
  }
});
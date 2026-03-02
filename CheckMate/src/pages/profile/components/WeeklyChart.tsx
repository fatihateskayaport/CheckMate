import GlassCard from '@/src/components/GlassCard';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export const WeeklyChart = ({ data }: { data: number[] }) => {
  const chartData = data && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];

  return (
    <View style={styles.outerWrapper}>
      <GlassCard intensity={0.6} style={styles.glassContainer}>
        <Text style={styles.title}>Haftalık Performans 📊</Text>
        
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
              datasets: [{ data: chartData }]
            }}
            width={screenWidth - 40} 
            height={180}
            withInnerLines={false}
            withOuterLines={false} 
            withVerticalLines={false}
            withHorizontalLines={false}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              propsForLabels: {
                fontSize: 10,
              },
              paddingRight: 45, 
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  glassContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0, 
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    alignSelf: 'flex-start',
    marginLeft: 20, 
  },
  chartContainer: {

    width: '100%',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
    marginRight: 0, 
  },
});
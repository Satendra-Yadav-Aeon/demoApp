import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';
import ScreenDimensions from '../../../utils/DimensionUtils';
import Colors from '../../../assets/colors/colors';
import { GRAPH_CONSTANT } from '../constants/ReportConstant';

const { screenWidth } = ScreenDimensions;

const Legend = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendColor, { backgroundColor: color }]} />
    <Text style={styles.legendText} adjustsFontSizeToFit={true}>{label}</Text>
  </View>
);

const TaskStackedBarChart = ({ chartData }) => {
  const {t} = useTranslation();

  if (Object.keys(chartData?.labels).length === 0) {
    return null;
  }

   // Filter out bars where all values are 0
  const filteredData = chartData?.labels
    .map((label, i) => ({
      label,
      values: [
        chartData.datasets[0][i] || 0,
        chartData.datasets[1][i] || 0,
        chartData.datasets[2][i] || 0,
      ],  
    }))
    .filter(item => item.values.reduce((sum, val) => sum + val, 0) > 0);

  if (filteredData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Y-axis title */}
      <Text style={styles.yAxisLabel} adjustsFontSizeToFit={true}>
        {t(GRAPH_CONSTANT.NO_TASK)}
      </Text>

      {/* Chart */}
      <ScrollView horizontal>
        <View>
          <StackedBarChart
            data={{
              labels: filteredData?.map(item => item.label),
              // legend: ["Finished", "Working", "Cancelled"],
              legend: [],
              data: filteredData?.map(item => item.values),
              barColors: ["#4CAF50", "#FFC107", "#F44336"],
            }}
            width={Math.max(screenWidth, chartData?.labels.length * 100 + 100, 400)}
            height={Math.min(chartData?.labels.length * 40 + 100, 400)}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            style={{padding: 40}}
          />
          {/* Custom legend */}
          <View style={styles.legendContainer}>
            <Legend color="#4CAF50" label='Finished' />
            <Legend color="#FFC107" label='Working' />
            <Legend color="#F44336" label='Cancelled' />
          </View>
        </View>
      </ScrollView>

      {/* X-axis title */}
      <Text style={styles.xAxisLabel} adjustsFontSizeToFit={true}>{t(GRAPH_CONSTANT.EMP_TASK_DATES)}</Text>
    </View>
  );
};

export default TaskStackedBarChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.red
  },
  yAxisLabel: {
    position: 'absolute', 
    top: '40%', 
    left: -20, 
    transform: [{ rotate: '-90deg' }], 
    fontWeight: 'bold'
  },
  xAxisLabel: {
    textAlign: 'center', 
    marginTop: 10, 
    fontWeight: 'bold'
  },
  legendContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  legendColor: {
    width: 14,
    height: 14,
    marginRight: 6,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
})

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import ScreenDimensions from '../../../utils/DimensionUtils';
import { isArrayLength } from '../../../utils/ValidationUtils';
import Colors from '../../../assets/colors/colors';
import { GRAPH_CONSTANT } from '../constants/ReportConstant';

const { screenWidth } = ScreenDimensions;

const AttendanceBarChart = ({ chartData }) => {
  if (!isArrayLength(chartData)) {
    return null;
  }

  const chartLabels = chartData?.map(item => {
    const initials = item.name?.slice(0, 3).toLowerCase();
    const [year, month, day] = item.date?.split('-');
    return `${initials}-${day}-${month}`;
  });

  const chartValues = chartData?.map(item => parseFloat(item.totalHours.toFixed(2)));

  return (
    <View style={styles.container}>
      {/* Y Axis Label */}
      <Text style={styles.yAxisLabel}>{GRAPH_CONSTANT.TOTAL_HRS}</Text>

      <ScrollView horizontal>
        <View>
          <BarChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartValues }],
            }}
            width={Math.max(screenWidth, chartLabels.length * 50 + 400)}
            // height={400}
            height={Math.min(chartLabels.length * 40 + 100, 400)}
            yAxisSuffix="h"
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            verticalLabelRotation={60}
            fromZero
            showValuesOnTopOfBars
            style={{ padding: 100 }}
          />

          {/* X Axis Label */}
          <Text style={styles.xAxisLabel}>{GRAPH_CONSTANT.EMP_ATTENDANCE_DATES}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceBarChart;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Y axis label on left
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20,
    borderColor: Colors.red
  },
  yAxisLabel: {
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
    position: 'absolute',
    left: 40, // adjust for spacing
    top: '50%',
  },
  xAxisLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
  },
});

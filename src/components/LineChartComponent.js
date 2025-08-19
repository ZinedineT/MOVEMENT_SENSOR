import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { styles } from '../styles/styles';

const LineChartComponent = ({ history, screenWidth, screenHeight }) => (
  <LineChart
    data={{
      labels: history.slice(0, 10).map(item => {
        const time = item.timestamp.split(' ')[1] || '';
        return time.length > 5 ? time.slice(0, 5) : time;
      }),
      datasets: [{ data: history.slice(0, 10).map(item => item.conteo) }],
    }}
    width={screenWidth * 0.9}
    height={Math.min(screenHeight * 0.3, 220)}
    chartConfig={{
      backgroundColor: '#fff',
      backgroundGradientFrom: '#f0f0f0',
      backgroundGradientTo: '#f0f0f0',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForLabels: {
        fontSize: 14,
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
      },
    }}
    bezier
    style={{ marginVertical: 20, borderRadius: 8 }}
    withDots={true}
    withShadow={false}
  />
);

export default LineChartComponent;

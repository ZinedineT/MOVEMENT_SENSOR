import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from '../styles/styles';

const LineChartComponent = ({ history, screenWidth, screenHeight }) => {
  try {
    // Validar datos
    const validHistory = history.filter(item => 
      item && typeof item.conteo === 'number' && item.timestamp
    );
    
    if (validHistory.length === 0) {
      return <Text style={styles.errorText}>Datos inválidos para el gráfico</Text>;
    }

    const chartWidth = Math.max(screenWidth * 0.9, validHistory.length * 60);

    return (
      <View style={styles.chartContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <LineChart
            data={{
              labels: validHistory.map(item => {
                const time = item.timestamp.split(' ')[1] || 'N/A';
                return time.length > 5 ? time.slice(0, 5) : time;
              }),
              datasets: [{ data: validHistory.map(item => item.conteo) }],
            }}
            width={chartWidth}
            height={Math.min(screenHeight * 0.3, 220)}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#F8FAFC',
              backgroundGradientTo: '#F8FAFC',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Verde moderno
              labelColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`, // Texto oscuro
              propsForLabels: {
                fontSize: 12,
                rotation: 45,
                translateY: 10,
                translateX: 10,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#F59E0B', // Naranja para los puntos
              },
            }}
            bezier
            style={styles.chart}
            withDots={true}
            withShadow={false}
            yAxisInterval={1}
            fromZero={true}
          />
        </ScrollView>
      </View>
    );
  } catch (error) {
    console.error('Error en LineChartComponent:', error);
    return <Text style={styles.errorText}>Error al renderizar el gráfico</Text>;
  }
};

export default LineChartComponent;
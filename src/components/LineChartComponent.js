import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from '../styles/styles';

const LineChartComponent = ({ history, screenWidth, screenHeight }) => {
  try {
    // Filtrar solo movimientos detectados para el gráfico
    const movementData = history.filter(item =>
      item && item.estado === 'detectado' && typeof item.conteo === 'number'
    );

    if (movementData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.infoText}>No hay datos de movimiento para mostrar</Text>
        </View>
      );
    }

    const chartWidth = Math.max(screenWidth * 0.9, movementData.length * 60);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Historial de Movimientos Detectados</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <LineChart
            data={{
              labels: movementData.map((item, index) => {
                // Mostrar menos etiquetas para mejor legibilidad
                if (movementData.length > 10 && index % Math.ceil(movementData.length / 8) !== 0) {
                  return '';
                }
                const time = item.timestamp ? item.timestamp.split(' ')[1] || '' : '';
                return time.length > 5 ? time.slice(0, 5) : time;
              }),
              datasets: [{
                data: movementData.map(item => item.conteo),
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                strokeWidth: 2
              }],
            }}
            width={chartWidth}
            height={Math.min(screenHeight * 0.3, 220)}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#F8FAFC',
              backgroundGradientTo: '#F8FAFC',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(31, 42, 68, ${opacity})`,
              propsForLabels: {
                fontSize: 10,
                rotation: 45,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#F59E0B',
              },
            }}
            bezier
            style={styles.chart}
            withDots={true}
            withShadow={false}
            withVerticalLines={movementData.length < 20}
            withHorizontalLines={true}
            yAxisInterval={1}
            fromZero={true}
          />
        </ScrollView>
      </View>
    );
  } catch (error) {
    console.error('Error en LineChartComponent:', error);
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.errorText}>Error al renderizar el gráfico</Text>
      </View>
    );
  }
};

export default LineChartComponent;

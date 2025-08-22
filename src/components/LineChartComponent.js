import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { styles } from '../styles/styles';

const LineChartComponent = ({ history, screenWidth, screenHeight }) => {
  try {
    // Cargar dinámicamente Victory según la plataforma
    const {
      VictoryChart,
      VictoryLine,
      VictoryAxis,
      VictoryTooltip,
      VictoryZoomContainer,
      VictoryTheme
    } = Platform.OS === 'web'
      ? require('victory') // Web usa victory normal
      : require('victory-native'); // Móvil usa victory-native

    // Filtrar datos válidos
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

    // Transformar datos para Victory
    const chartData = movementData.map((item, index) => ({
      x: index + 1,
      y: item.conteo,
      label: `${item.timestamp?.split(' ')[1]?.slice(0, 5) || ''}\n${item.conteo}`
    }));

    // Etiquetas del eje X
    const labels = movementData.map(item => {
      const time = item.timestamp ? item.timestamp.split(' ')[1] || '' : '';
      return time.length > 5 ? time.slice(0, 5) : time;
    });

    const chartWidth = Math.max(screenWidth * 0.9, movementData.length * 80);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Historial de Movimientos Detectados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <VictoryChart
            width={chartWidth}
            height={Math.min(screenHeight * 0.35, 250)}
            theme={VictoryTheme?.material || {}}
            domainPadding={{ x: 40, y: 20 }}
            containerComponent={
              <VictoryZoomContainer
                zoomDimension="x"
                allowZoom
                allowPan
                zoomDomain={{ x: [0, Math.min(movementData.length, 10)] }}
                voronoiDimension="x"
              />
            }
          >
            {/* Eje X */}
            <VictoryAxis
              tickValues={chartData.map(d => d.x)}
              tickFormat={(t, i) =>
                (movementData.length > 10 && i % Math.ceil(movementData.length / 8) !== 0)
                  ? ''
                  : labels[i]
              }
              style={{
                tickLabels: { fontSize: 10, angle: 0 }
              }}
            />

            {/* Eje Y */}
            <VictoryAxis
              dependentAxis
              tickFormat={(y) => y}
              style={{
                tickLabels: { fontSize: 10 }
              }}
            />

            {/* Línea con labels y tooltips */}
            <VictoryLine
              data={chartData}
              interpolation="monotoneX"
              labels={({ datum }) => datum.label}
              labelComponent={<VictoryTooltip style={{ fontSize: 12 }} />}
              style={{
                data: { stroke: "#22C55E", strokeWidth: 2 },
              }}
            />
          </VictoryChart>
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

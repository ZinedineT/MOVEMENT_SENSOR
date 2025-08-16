import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Dimensions, PixelRatio } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import mqtt from 'mqtt';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [lastMessage, setLastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const fontScale = PixelRatio.getFontScale();

  useEffect(() => {
    // Cargar historial desde AsyncStorage
    AsyncStorage.getItem('history').then(savedHistory => {
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    });

    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      protocol: 'wss',
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a broker MQTT');
      setIsConnected(true);
      client.subscribe('iot/zinedine/presence', (err) => {
        if (err) console.error('Error al suscribirse:', err);
      });
    });

    client.on('error', (err) => {
      console.error('Error de conexión MQTT:', err);
      setIsConnected(false);
    });

    client.on('close', () => {
      console.log('❌ Desconectado de MQTT, intentando reconectar...');
      setIsConnected(false);
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Mensaje recibido:', data); // Depuración
        const entry = {
          ...data,
          timestamp: new Date().toLocaleString(),
        };
        setLastMessage(entry);
        setHistory(prev => [entry, ...prev.slice(0, 99)]);
        AsyncStorage.setItem('history', JSON.stringify([entry, ...history.slice(0, 99)]));
      } catch (err) {
        console.error('Error parseando mensaje:', err);
      }
    });

    return () => client.end();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <MaterialIcons
        name={item.estado === 'detectado' ? 'person' : 'person-off'}
        size={Math.min(20 * fontScale, 24)}
        color={item.estado === 'detectado' ? '#28a745' : '#6c757d'}
      />
      <Text style={[styles.historyText, { fontSize: 14 * fontScale }]}>
        {item.estado.toUpperCase()} - Conteo: {item.conteo} - {item.timestamp}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: 22 * fontScale }]}>
        📡 DETECTOR DE PRESENCIA CISTCOR
      </Text>

      <View style={styles.connectionIndicator}>
        <MaterialIcons
          name={isConnected ? 'wifi' : 'wifi-off'}
          size={Math.min(24 * fontScale, 28)}
          color={isConnected ? '#28a745' : '#dc3545'}
        />
        <Text
          style={[styles.connectionText, { fontSize: 16 * fontScale, color: isConnected ? '#28a745' : '#dc3545' }]}
        >
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Text>
      </View>

      {lastMessage && (
        <View
          style={[
            styles.card,
            { backgroundColor: lastMessage.estado === 'detectado' ? '#d4f5d0' : '#f5d0d0' },
          ]}
        >
          <Text style={[styles.cardText, { fontSize: 16 * fontScale }]}>
            Estado: {lastMessage.estado.toUpperCase()}
          </Text>
          <Text style={[styles.cardText, { fontSize: 16 * fontScale }]}>
            Conteo: {lastMessage.conteo}
          </Text>
          <Text style={[styles.cardText, { fontSize: 16 * fontScale }]}>
            Última lectura: {lastMessage.timestamp}
          </Text>
        </View>
      )}

      <View style={styles.historyHeader}>
        <Text style={[styles.subtitle, { fontSize: 18 * fontScale }]}>Historial</Text>
        <Button
          title="Limpiar historial"
          onPress={() => {
            setHistory([]);
            AsyncStorage.removeItem('history');
          }}
        />
      </View>

      {history.length > 0 && (
        <LineChart
          data={{
            labels: history.slice(0, 10).map(item => {
              const time = item.timestamp.split(' ')[1] || '';
              return time.length > 5 ? time.slice(0, 5) : time; // Acortar etiquetas para móviles
            }),
            datasets: [{ data: history.slice(0, 10).map(item => item.conteo) }],
          }}
          width={screenWidth * 0.9} // 90% del ancho de la pantalla
          height={Math.min(screenHeight * 0.3, 220)} // Escalar altura según pantalla
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForLabels: {
              fontSize: Math.min(12 * fontScale, 14), // Ajustar tamaño de etiquetas
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
          withShadow={true}
          withScrollableDot={false} // Deshabilitar interactividad para evitar errores de responder
        />
      )}

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={{ flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: '5%', // Usar porcentaje para responsividad
    paddingTop: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '600',
    color: '#555',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    color: '#333',
    marginBottom: 5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  historyText: {
    marginLeft: 10,
    color: '#333',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  connectionText: {
    marginLeft: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

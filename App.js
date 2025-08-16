// App.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import mqtt from 'mqtt';
import { ref, onValue, push, remove, off } from 'firebase/database';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from './firebaseConfig';

export default function App() {
  const [lastMessage, setLastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const fontScale = 1;

  useEffect(() => {
    console.log('Iniciando useEffect...');

    AsyncStorage.getItem('history')
      .then(savedHistory => {
        if (savedHistory) {
          console.log('Historial cargado desde AsyncStorage:', savedHistory);
          setHistory(JSON.parse(savedHistory));
        }
      })
      .catch(error => console.error('Error cargando historial desde AsyncStorage:', error));

    // Cargar historial desde Firebase
    try {
      console.log('Conectando a Firebase Realtime Database...');
      const movimientosRef = ref(database, '/movimientos');

      onValue(
        movimientosRef,
        snapshot => {
          console.log('Snapshot recibido de Firebase:', snapshot.val());
          const data = snapshot.val();
          if (data) {
            const historyFromFirebase = Object.values(data).reverse();
            setHistory(historyFromFirebase);
            AsyncStorage.setItem('history', JSON.stringify(historyFromFirebase)).catch(error =>
              console.error('Error guardando historial en AsyncStorage:', error)
            );
          }
        },
        error => {
          console.error('Error al cargar datos de Firebase:', error);
          setError(error.message);
        }
      );
    } catch (err) {
      console.error('Error inicializando Firebase:', err);
      setError(err.message);
    }

    // Conectar a MQTT
    console.log('Conectando a MQTT...');
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      protocol: 'wss',
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a broker MQTT');
      setIsConnected(true);
      client.subscribe('iot/zinedine/presence', err => {
        if (err) {
          console.error('Error al suscribirse al topic:', err);
          setError(err.message);
        } else {
          console.log('Suscrito al topic iot/zinedine/presence');
        }
      });
    });

    client.on('error', err => {
      console.error('Error de conexión MQTT:', err);
      setIsConnected(false);
      setError(err.message);
    });

    client.on('close', () => {
      console.log('❌ Desconectado de MQTT, intentando reconectar...');
      setIsConnected(false);
    });

    client.on('message', (topic, message) => {
      try {
        console.log('Mensaje MQTT recibido en topic:', topic, 'Mensaje:', message.toString());
        const data = JSON.parse(message.toString());
        const entry = {
          ...data,
          timestamp: new Date().toLocaleString(),
        };
        console.log('Datos procesados:', entry);
        setLastMessage(entry);
        setHistory(prev => [entry, ...prev.slice(0, 99)]);
        AsyncStorage.setItem('history', JSON.stringify([entry, ...history.slice(0, 99)]))
          .then(() => console.log('Historial guardado en AsyncStorage'))
          .catch(error => console.error('Error guardando en AsyncStorage:', error));

        // Guardar en Firebase
        console.log('Guardando en Firebase...');
        push(ref(database, '/movimientos'), entry)
          .then(() => console.log('✅ Datos guardados en Firebase'))
          .catch(error => {
            console.error('Error al guardar en Firebase:', error);
            setError(error.message);
          });
      } catch (err) {
        console.error('Error parseando mensaje MQTT:', err);
        setError(err.message);
      }
    });

    return () => {
      console.log('Limpiando useEffect...');
      client.end();
      off(ref(database, '/movimientos'));
    };
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

      <Button
        title="Probar escritura en Firebase"
        onPress={() => {
          const testEntry = {
            conteo: 0,
            estado: 'prueba',
            timestamp: new Date().toLocaleString(),
          };
          console.log('Probando escritura en Firebase...');
          push(ref(database, '/movimientos'), testEntry)
            .then(() => console.log('✅ Prueba guardada en Firebase'))
            .catch(error => {
              console.error('Error en prueba:', error);
              setError(error.message);
            });
        }}
      />

      {error && (
        <Text style={styles.errorText}>Error: {error}</Text>
      )}

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
          style={[styles.card, { backgroundColor: lastMessage.estado === 'detectado' ? '#d4f5d0' : '#f5d0d0' }]}
        >
          <Text style={[styles.cardText, { fontSize: 16 * fontScale }]}>Estado: {lastMessage.estado.toUpperCase()}</Text>
          <Text style={[styles.cardText, { fontSize: 16 * fontScale }]}>Conteo: {lastMessage.conteo}</Text>
          <Text style={[styles.cardText, { fontSize: 16 * fontScale }]}>Última lectura: {lastMessage.timestamp}</Text>
        </View>
      )}

      <View style={styles.historyHeader}>
        <Text style={[styles.subtitle, { fontSize: 18 * fontScale }]}>Historial</Text>
        <Button
          title="Limpiar historial"
          onPress={() => {
            setHistory([]);
            AsyncStorage.removeItem('history').catch(error =>
              console.error('Error limpiando AsyncStorage:', error)
            );
            remove(ref(database, '/movimientos')).catch(error =>
              console.error('Error limpiando Firebase:', error)
            );
          }}
        />
      </View>

      {history.length > 0 && (
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
              fontSize: Math.min(12 * fontScale, 14),
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
    paddingHorizontal: '5%',
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
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

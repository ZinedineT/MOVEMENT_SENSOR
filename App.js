import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import mqtt from 'mqtt';
import { MaterialIcons } from '@expo/vector-icons'; // npm install @expo/vector-icons

export default function App() {
  const [lastMessage, setLastMessage] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', { protocol: 'wss' });

    client.on('connect', () => {
      console.log('✅ Conectado a broker MQTT');
      client.subscribe('iot/zinedine/presence');
    });

    client.on('message', (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const entry = {
          ...data,
          timestamp: new Date().toLocaleString()
        };
        setLastMessage(entry);
        setHistory(prev => [entry, ...prev]);
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
        size={20}
        color={item.estado === 'detectado' ? 'green' : 'gray'}
      />
      <Text style={{ marginLeft: 10 }}>
        {item.estado.toUpperCase()} - Conteo: {item.conteo} - {item.timestamp}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Detector de Presencia</Text>

      {lastMessage && (
        <View style={[
          styles.card,
          { backgroundColor: lastMessage.estado === 'detectado' ? '#d4f5d0' : '#f5d0d0' }
        ]}>
          <Text style={styles.cardText}>Estado: {lastMessage.estado.toUpperCase()}</Text>
          <Text style={styles.cardText}>Conteo: {lastMessage.conteo}</Text>
          <Text style={styles.cardText}>Última lectura: {lastMessage.timestamp}</Text>
        </View>
      )}

      <Text style={styles.subtitle}>Historial</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20, fontWeight: 'bold' },
  card: { padding: 15, borderRadius: 8, marginBottom: 20 },
  cardText: { fontSize: 16 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  }
});

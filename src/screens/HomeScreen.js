import React, { useState } from 'react';
import { Text, View, Button, FlatList, Dimensions } from 'react-native';
import { styles } from '../styles/styles';
import ConnectionIndicator from '../components/ConnectionIndicator';
import LastMessageCard from '../components/LastMessageCard';
import LineChartComponent from '../components/LineChartComponent';
import HistoryItem from '../components/HistoryItem';
import useFirebase from '../hooks/useFirebase';
import useMQTT from '../hooks/useMQTT';
import useStorage from '../hooks/useStorage';

export default function HomeScreen() {
  const [lastMessage, setLastMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Usar hooks personalizados
  useStorage(setHistory);
  useFirebase(setHistory, setError);
  useMQTT(setLastMessage, setHistory, setIsConnected, setError);

  const handleClearHistory = () => {
    setHistory([]);
    remove(ref(database, '/movimientos')).catch(error =>
      console.error('Error limpiando Firebase:', error)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 DETECTOR DE PRESENCIA CISTCOR</Text>

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

      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <ConnectionIndicator isConnected={isConnected} />

      {lastMessage && <LastMessageCard lastMessage={lastMessage} />}

      <View style={styles.historyHeader}>
        <Text style={styles.subtitle}>Historial</Text>
        <Button title="Limpiar historial" onPress={handleClearHistory} />
      </View>

      {history.length > 0 && (
        <LineChartComponent history={history} screenWidth={screenWidth} screenHeight={screenHeight} />
      )}

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <HistoryItem item={item} />}
        style={{ flexGrow: 1 }}
      />
    </View>
  );
}

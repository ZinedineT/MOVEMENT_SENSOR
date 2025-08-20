import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, Dimensions, Image, SafeAreaView } from 'react-native';
import { styles } from '../styles/styles';
import ConnectionIndicator from '../components/ConnectionIndicator';
import LastMessageCard from '../components/LastMessageCard';
import LineChartComponent from '../components/LineChartComponent';
import HistoryItem from '../components/HistoryItem';
import useFirebase from '../hooks/useFirebase';
import useMQTT from '../hooks/useMQTT';
import useStorage from '../hooks/useStorage';
import { database } from '../config/firebaseConfig'; 
import { ref, push, remove } from 'firebase/database';

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

  // Depuración de history
  useEffect(() => {
    console.log('History:', history);
  }, [history]);

  const handleClearHistory = () => {
    setHistory([]);
    remove(ref(database, '/movimientos')).catch(error =>
      console.error('Error limpiando Firebase:', error)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/logo.png')} // Restaurado el logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>📡 DETECTOR DE PRESENCIA CISTCOR</Text>
      </View>

      {/* <Button
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
        color="#007AFF"
      /> */}

      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <ConnectionIndicator isConnected={isConnected} />

      {lastMessage && <LastMessageCard lastMessage={lastMessage} />}

      <View style={styles.historyHeader}>
        <Text style={styles.subtitle}>Historial</Text>
        <Button title="Limpiar historial" onPress={handleClearHistory} color="#007AFF" />
      </View>

      {history.length > 0 ? (
        <LineChartComponent history={history} screenWidth={screenWidth} screenHeight={screenHeight} />
      ) : (
        <Text style={styles.errorText}>No hay datos para mostrar en el gráfico</Text>
      )}

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <HistoryItem item={item} />}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
}
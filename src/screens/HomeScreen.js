import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, Dimensions, Image, ScrollView,StatusBar } from 'react-native';
import { styles } from '../styles/styles';
import ConnectionIndicator from '../components/ConnectionIndicator';
import LastMessageCard from '../components/LastMessageCard';
import LineChartComponent from '../components/LineChartComponent';
import HistoryItem from '../components/HistoryItem';
import useFirebase from '../services/useFirebase';
import useMQTT from '../services/useMQTT';
import useStorage from '../services/useStorage';
import { database } from '../config/firebaseConfig';
import { ref, remove } from 'firebase/database';

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

  // HomeScreen.js - versión mejorada
  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>📡 DETECTOR DE PRESENCIA</Text>
          <Text style={styles.subtitle}>Monitoreo en tiempo real</Text>
        </View>

        {/* Estado de conexión */}
        <View style={styles.statusContainer}>
          <ConnectionIndicator isConnected={isConnected} />
          <Text style={styles.statusText}>
            {isConnected ? 'Conectado' : 'Desconectado'} - {history.length} eventos
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Último mensaje */}
        {lastMessage && <LastMessageCard lastMessage={lastMessage} />}

        {/* Gráfico y controles */}
        <View style={styles.sectionContainer}>
          <View style={[styles.row, styles.spaceBetween, styles.sectionHeader]}>
            <Text style={styles.sectionTitle}>Historial de Eventos</Text>
            <Button
              title="🗑️ Limpiar"
              onPress={handleClearHistory}
              color="#ff3300"
              disabled={history.length === 0}
            />
          </View>

          {history.length > 0 ? (
            <LineChartComponent
              history={history}
              screenWidth={screenWidth}
              screenHeight={screenHeight}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>📊 No hay datos para mostrar</Text>
              <Text style={styles.emptyStateSubtext}>Los eventos aparecerán aquí</Text>
            </View>
          )}
        </View>

        {/* Lista de historial */}
        {history.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Detalles de Eventos</Text>
            <FlatList
              data={history.slice(0, 10)} // Mostrar solo los últimos 10
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <HistoryItem item={item} />}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

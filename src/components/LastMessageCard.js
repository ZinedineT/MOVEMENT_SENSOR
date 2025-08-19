import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles';

const LastMessageCard = ({ lastMessage }) => (
  <View
    style={[styles.card, { backgroundColor: lastMessage.estado === 'detectado' ? '#d4f5d0' : '#f5d0d0' }]}
  >
    <Text style={styles.cardText}>Estado: {lastMessage.estado.toUpperCase()}</Text>
    <Text style={styles.cardText}>Conteo: {lastMessage.conteo}</Text>
    <Text style={styles.cardText}>Última lectura: {lastMessage.timestamp}</Text>
  </View>
);

export default LastMessageCard;

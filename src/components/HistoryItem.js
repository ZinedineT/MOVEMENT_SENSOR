import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const HistoryItem = ({ item }) => (
  <View style={styles.historyItem}>
    <MaterialIcons
      name={item.estado === 'detectado' ? 'person' : 'person-off'}
      size={24}
      color={item.estado === 'detectado' ? '#28a745' : '#6c757d'}
    />
    <Text style={styles.historyText}>
      {item.estado.toUpperCase()} - Conteo: {item.conteo} - {item.timestamp}
    </Text>
  </View>
);

export default HistoryItem;

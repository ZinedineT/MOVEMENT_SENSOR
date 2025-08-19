import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/styles';

const ConnectionIndicator = ({ isConnected }) => (
  <View style={styles.connectionIndicator}>
    <MaterialIcons
      name={isConnected ? 'wifi' : 'wifi-off'}
      size={28}
      color={isConnected ? '#28a745' : '#dc3545'}
    />
    <Text
      style={[styles.connectionText, { color: isConnected ? '#28a745' : '#dc3545' }]}
    >
      {isConnected ? 'Conectado' : 'Desconectado'}
    </Text>
  </View>
);

export default ConnectionIndicator;

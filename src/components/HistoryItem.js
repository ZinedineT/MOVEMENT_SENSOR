import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const HistoryItem = ({ item }) => {
  if (!item) return null;

  const getIconConfig = (estado) => {
    switch(estado) {
      case 'detectado':
        return { name: 'motion-sensor-active', color: '#28a745' };
      case 'inactivo_largo':
        return { name: 'timer-off', color: '#fd7e14' };
      default:
        return { name: 'help', color: '#6c757d' };
    }
  };

  const getText = (estado, conteo) => {
    switch(estado) {
      case 'detectado': return `Movimiento #${conteo}`;
      case 'inactivo_largo': return `Inactividad prolongada #${conteo}`;
      default: return `Evento #${conteo}`;
    }
  };

  const iconConfig = getIconConfig(item.estado);

  return (
    <View style={styles.historyItem}>
      <MaterialIcons
        name={iconConfig.name}
        size={24}
        color={iconConfig.color}
      />
      <View style={styles.textContainer}>
        <Text style={styles.historyText}>
          {getText(item.estado, item.conteo)}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp || 'Fecha no disponible'}
        </Text>
        {item.device_id && (
          <Text style={styles.deviceText}>{item.device_id}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  historyText: {
    color: '#1F2A44',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  deviceText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
});

export default HistoryItem;

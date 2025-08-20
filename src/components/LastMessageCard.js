import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LastMessageCard = ({ lastMessage }) => {
  if (!lastMessage) return null;

  const getCardStyle = (estado) => {
    switch(estado) {
      case 'detectado':
        return styles.detectedCard;
      case 'inactivo_largo':
        return styles.inactiveCard;
      default:
        return styles.card;
    }
  };

  const getIcon = (estado) => {
    switch(estado) {
      case 'detectado': return '🎯';
      case 'inactivo_largo': return '⏰';
      default: return '📋';
    }
  };

  const getTitle = (estado) => {
    switch(estado) {
      case 'detectado': return 'Movimiento Detectado';
      case 'inactivo_largo': return 'Inactividad Prolongada';
      default: return 'Evento';
    }
  };

  return (
    <View style={[styles.card, getCardStyle(lastMessage.estado)]}>
      <Text style={styles.icon}>{getIcon(lastMessage.estado)}</Text>
      <Text style={styles.cardTitle}>{getTitle(lastMessage.estado)}</Text>
      <Text style={styles.cardText}>Evento #{lastMessage.conteo}</Text>
      <Text style={styles.cardText}>
        {new Date(lastMessage.timestamp).toLocaleString()}
      </Text>
      {lastMessage.device_id && (
        <Text style={styles.deviceText}>Dispositivo: {lastMessage.device_id}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detectedCard: {
    backgroundColor: '#DCFCE7',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  inactiveCard: {
    backgroundColor: '#FFEDD5',
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  deviceText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  }
});

export default LastMessageCard;

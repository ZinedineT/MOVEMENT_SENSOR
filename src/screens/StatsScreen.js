import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { styles } from '../styles/styles';
import { database } from '../config/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    eventsByHour: Array(24).fill(0),
    eventsByType: {}
  });

  useEffect(() => {
    const movimientosRef = ref(database, '/movimientos');

    const unsubscribe = onValue(movimientosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        calculateStatistics(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateStatistics = (data) => {
    const events = Object.values(data);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const eventsByHour = Array(24).fill(0);
    const eventsByType = {};
    let todayCount = 0;

    events.forEach(event => {
      const eventDate = new Date(event.timestamp);

      // Contar eventos de hoy
      if (eventDate >= today) todayCount++;

      // Contar eventos por hora
      const hour = eventDate.getHours();
      eventsByHour[hour] = (eventsByHour[hour] || 0) + 1;

      // Contar por tipo
      eventsByType[event.tipo] = (eventsByType[event.tipo] || 0) + 1;
    });

    setStats({
      totalEvents: events.length,
      todayEvents: todayCount,
      eventsByHour,
      eventsByType
    });
  };

  const getMostActiveHour = () => {
    let maxHour = 0;
    let maxCount = 0;

    stats.eventsByHour.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = hour;
      }
    });

    return { hour: maxHour, count: maxCount };
  };

  const mostActive = getMostActiveHour();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Resumen de Eventos</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalEvents}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.todayEvents}</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Hora más activa</Text>
        <View style={styles.highlightCard}>
          <Text style={styles.highlightText}>
            {mostActive.hour}:00 - {mostActive.hour + 1}:00
          </Text>
          <Text style={styles.highlightSubtext}>
            {mostActive.count} eventos detectados
          </Text>
        </View>
      </View>

      {Object.keys(stats.eventsByType).length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Eventos por Tipo</Text>
          {Object.entries(stats.eventsByType).map(([type, count]) => (
            <View key={type} style={styles.typeRow}>
              <Text style={styles.typeLabel}>{type}</Text>
              <Text style={styles.typeCount}>{count}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

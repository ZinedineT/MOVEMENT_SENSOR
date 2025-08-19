import { useEffect } from 'react';
import mqtt from 'mqtt';
import { ref, push } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import useStorage from './useStorage';

const useMQTT = (setLastMessage, setHistory, setIsConnected, setError) => {
  useEffect(() => {
    console.log('Conectando a MQTT...');
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      protocol: 'wss',
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('✅ Conectado a broker MQTT');
      setIsConnected(true);
      client.subscribe('iot/zinedine/presence', err => {
        if (err) {
          console.error('Error al suscribirse al topic:', err);
          setError(err.message);
        } else {
          console.log('Suscrito al topic iot/zinedine/presence');
        }
      });
    });

    client.on('error', err => {
      console.error('Error de conexión MQTT:', err);
      setIsConnected(false);
      setError(err.message);
    });

    client.on('close', () => {
      console.log('❌ Desconectado de MQTT, intentando reconectar...');
      setIsConnected(false);
    });

    client.on('message', (topic, message) => {
      try {
        console.log('Mensaje MQTT recibido en topic:', topic, 'Mensaje:', message.toString());
        const data = JSON.parse(message.toString());
        const entry = {
          ...data,
          timestamp: new Date().toLocaleString(),
        };
        console.log('Datos procesados:', entry);
        setLastMessage(entry);
        setHistory(prev => [entry, ...prev.slice(0, 99)]);

        // Guardar en Firebase
        console.log('Guardando en Firebase...');
        push(ref(database, '/movimientos'), entry)
          .then(() => console.log('✅ Datos guardados en Firebase'))
          .catch(error => {
            console.error('Error al guardar en Firebase:', error);
            setError(error.message);
          });
      } catch (err) {
        console.error('Error parseando mensaje MQTT:', err);
        setError(err.message);
      }
    });

    return () => {
      console.log('Desconectando de MQTT...');
      client.end();
    };
  }, [setLastMessage, setHistory, setIsConnected, setError]);
};

export default useMQTT;

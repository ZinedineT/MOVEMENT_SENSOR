import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const useNotifications = (lastMessage) => {
  useEffect(() => {
    if (lastMessage?.estado === 'detectado') {
      Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Movimiento Detectado',
          body: `Se detectó movimiento #${lastMessage.conteo}`,
        },
        trigger: null,
      });
    }
  }, [lastMessage]);
};

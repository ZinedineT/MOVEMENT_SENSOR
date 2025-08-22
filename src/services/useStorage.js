import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = (setHistory) => {
  useEffect(() => {
    AsyncStorage.getItem('history')
      .then(savedHistory => {
        if (savedHistory) {
          console.log('Historial cargado desde AsyncStorage:', savedHistory);
          setHistory(JSON.parse(savedHistory));
        }
      })
      .catch(error => console.error('Error cargando historial desde AsyncStorage:', error));

    return () => {
      AsyncStorage.setItem('history', JSON.stringify([])).catch(error =>
        console.error('Error limpiando AsyncStorage:', error)
      );
    };
  }, [setHistory]);
};

export default useStorage;

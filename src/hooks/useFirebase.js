import { useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const useFirebase = (setHistory, setError) => {
  useEffect(() => {
    console.log('Conectando a Firebase Realtime Database...');
    const movimientosRef = ref(database, '/movimientos');

    onValue(
      movimientosRef,
      snapshot => {
        console.log('Snapshot recibido de Firebase:', snapshot.val());
        const data = snapshot.val();
        if (data) {
          const historyFromFirebase = Object.values(data).reverse();
          setHistory(historyFromFirebase);
        }
      },
      error => {
        console.error('Error al cargar datos de Firebase:', error);
        setError(error.message);
      }
    );

    return () => {
      console.log('Desconectando de Firebase...');
      off(movimientosRef);
    };
  }, [setHistory, setError]);
};

export default useFirebase;

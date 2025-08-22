// screens/ExportScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ExportScreen = ({ history }) => {
  const exportData = async () => {
    const csv = history.map(item =>
      `${item.timestamp},${item.estado},${item.conteo}`
    ).join('\n');

    const fileUri = FileSystem.documentDirectory + 'movimientos.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv);
    await Sharing.shareAsync(fileUri);
  };

  return (
    <View>
      <Button title="📤 Exportar a CSV" onPress={exportData} />
    </View>
  );
};

export default ExportScreen;

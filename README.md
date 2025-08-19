# sensor-app

Este proyecto es una aplicación de detección de presencia que utiliza MQTT y Firebase para gestionar y visualizar datos en tiempo real.

## Estructura del Proyecto

```
sensor-app
├── src
│   ├── components
│   │   ├── ConnectionStatus.js
│   │   ├── CurrentStatus.js
│   │   ├── HistoryChart.js
│   │   └── HistoryList.js
│   ├── services
│   │   ├── mqttService.js
│   │   ├── firebaseService.js
│   │   └── storageService.js
│   ├── hooks
│   │   └── useDataManagement.js
│   ├── styles
│   │   └── styles.js
│   ├── constants
│   │   └── config.js
│   └── App.js
├── firebaseConfig.js
└── README.md
```

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd sensor-app
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

Para iniciar la aplicación, ejecuta el siguiente comando:

```bash
npm start
```

La aplicación se abrirá en tu navegador predeterminado.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.
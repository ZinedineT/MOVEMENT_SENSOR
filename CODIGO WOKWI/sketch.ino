#include <WiFi.h>
#include <PubSubClient.h>

// ==== CONFIGURACIÓN WIFI ====
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// ==== CONFIGURACIÓN MQTT ====
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic = "iot/zinedine/presence";

// ==== CONFIGURACIÓN SENSORES ====
const int pirPin = 14;
const int ledPin = 26;
const int relePin = 27;

// ==== VARIABLES MEJORADAS ====
int conteo = 0;
unsigned long ultimoTiempoMovimiento = 0;
unsigned long ultimoMensajeEnviado = 0;
bool estadoAnterior = LOW;
bool movimientoActivo = false;

// Tiempos configurables (en milisegundos)
const unsigned long DEBOUNCE_TIME = 200;       // 200ms para evitar falsos positivos
const unsigned long TIEMPO_INACTIVIDAD = 30000; // 30 segundos para reportar inactividad
const unsigned long INTERVALO_MENSAJES = 5000;  // 5 segundos entre mensajes similares

// ==== OBJETOS DE WIFI Y MQTT ====
WiFiClient espClient;
PubSubClient client(espClient);

// ==== CONEXIÓN WIFI ====
void conectarWiFi() {
  Serial.print("Conectando a WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  unsigned long inicio = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - inicio < 10000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Conectado a WiFi");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ Error conectando a WiFi");
  }
}

// ==== CONEXIÓN MQTT ====
void conectarMQTT() {
  unsigned long inicio = millis();
  while (!client.connected() && millis() - inicio < 5000) {
    Serial.print("Conectando a MQTT...");
    if (client.connect("ESP32Client-Zinedine")) {
      Serial.println("✅ Conectado a broker MQTT");
      return;
    } else {
      Serial.print("❌ Error, rc=");
      Serial.print(client.state());
      Serial.println(" - Reintentando en 2 segundos...");
      delay(2000);
    }
  }
}

// ==== ENVIAR MENSAJE MQTT (SIN ArduinoJson) ====
void enviarMensajeMQTT(const char* estado) {
  unsigned long ahora = millis();

  // Evitar enviar mensajes demasiado seguidos (especialmente inactivo)
  if (ahora - ultimoMensajeEnviado < INTERVALO_MENSAJES && strcmp(estado, "inactivo") == 0) {
    return;
  }

  // Crear mensaje JSON manualmente
  char payload[150];
  snprintf(payload, sizeof(payload),
           "{\"conteo\":%d, \"estado\":\"%s\", \"timestamp\":%lu, \"device_id\":\"esp32_zinedine\"}",
           conteo, estado, ahora);

  if (client.publish(mqtt_topic, payload)) {
    Serial.print("📤 Mensaje enviado: ");
    Serial.println(payload);
    ultimoMensajeEnviado = ahora;
  } else {
    Serial.println("❌ Error enviando mensaje MQTT");
  }
}

// ==== DETECCIÓN DE MOVIMIENTO MEJORADA ====
bool detectarMovimiento() {
  static unsigned long ultimoTiempoEstable = 0;
  static bool estadoEstable = LOW;
  int lecturaActual = digitalRead(pirPin);

  // Filtro de debounce mejorado
  if (lecturaActual != estadoEstable) {
    ultimoTiempoEstable = millis();
    estadoEstable = lecturaActual;
  }

  // Solo considerar válido después del tiempo de debounce
  if (millis() - ultimoTiempoEstable > DEBOUNCE_TIME) {
    return (lecturaActual == HIGH);
  }

  return (estadoAnterior == HIGH); 
}

// ==== VERIFICAR TIEMPO DE INACTIVIDAD ====
void verificarInactividad() {
  unsigned long ahora = millis();

  // Reportar inactividad periódica (solo si hubo movimiento antes)
  if (movimientoActivo && ahora - ultimoTiempoMovimiento > TIEMPO_INACTIVIDAD) {
    enviarMensajeMQTT("inactivo_largo");
    ultimoTiempoMovimiento = ahora;
    Serial.println("⏰ Inactividad prolongada reportada");
  }
}

void setup() {
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(relePin, OUTPUT);
  Serial.begin(115200);

  Serial.println("🚀 Iniciando detector de presencia...");
  conectarWiFi();
  client.setServer(mqtt_server, mqtt_port);
  conectarMQTT();

  // Mensaje inicial de configuración
  Serial.println("✅ Sistema inicializado correctamente");
  Serial.println("📊 Configuración:");
  Serial.println("   - Debounce: 200ms");
  Serial.println("   - Reporte inactividad: 30s");
  Serial.println("   - Intervalo mensajes: 5s");
}

void loop() {
  // Mantener conexiones
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi desconectado, intentando reconectar...");
    conectarWiFi();
  }

  if (!client.connected()) {
    conectarMQTT();
  }
  client.loop();

  // Detección de movimiento
  bool movimientoActual = detectarMovimiento();
  unsigned long ahora = millis();

  // Detección de movimiento (flanco de subida)
  if (movimientoActual && !movimientoActivo) {
    conteo++;
    ultimoTiempoMovimiento = ahora;
    movimientoActivo = true;
    digitalWrite(ledPin, HIGH);
    digitalWrite(relePin, HIGH);

    enviarMensajeMQTT("detectado");
    Serial.println("🎯 Movimiento detectado!");
  }

  // Detección de fin de movimiento (flanco de bajada)
  if (movimientoActivo && !movimientoActual) {
    movimientoActivo = false;
    digitalWrite(ledPin, LOW);
    digitalWrite(relePin, LOW);

    // Solo enviar "inactivo" inmediatamente si el movimiento fue muy corto
    if (ahora - ultimoTiempoMovimiento < 2000) {
      enviarMensajeMQTT("inactivo");
    }
    Serial.println("💤 Movimiento terminado");
  }

  // Verificar inactividad prolongada
  verificarInactividad();

  estadoAnterior = movimientoActual;
  delay(100);
}

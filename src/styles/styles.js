import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Fondo claro y moderno
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 180,
    height: 90,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2A44', // Azul oscuro para el título
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563', // Gris suave para subtítulos
  },
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
  cardText: {
    fontSize: 16,
    color: '#1F2A44',
    marginBottom: 8,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Borde claro
  },
  historyText: {
    marginLeft: 12,
    color: '#1F2A44',
    fontSize: 14,
    fontWeight: '500',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    justifyContent: 'center',
  },
  connectionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  errorText: {
    color: '#DC2626', // Rojo vibrante para errores
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    borderRadius: 12,
  },
  flatList: {
    flexGrow: 1,
  },
});
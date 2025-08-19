import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: '5%',
    paddingTop: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    fontSize: 22,
  },
  subtitle: {
    fontWeight: '600',
    color: '#555',
    fontSize: 18,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  cardText: {
    color: '#333',
    marginBottom: 5,
    fontSize: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  historyText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  connectionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

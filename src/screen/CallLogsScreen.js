import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CallContext } from './../contexts/CallContext';

export default function CallLogsScreen() {
  const { callLogs } = useContext(CallContext);

  const getCallIcon = mode => {
    switch (mode) {
      case 'incoming':
        return <MaterialIcons name="call-received" size={24} color="green" />;
      case 'outgoing':
        return <MaterialIcons name="call-made" size={24} color="blue" />;
      case 'missed':
        return <MaterialIcons name="call-missed" size={24} color="red" />;
      default:
        return <MaterialIcons name="call" size={24} color="#555" />;
    }
  };

  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Call Logs</Text>
        <Text style={styles.subtitle}>{callLogs.length} calls</Text>
      </View>

      <FlatList
        data={callLogs}
        keyExtractor={(item, index) => `${item.id}-${item.mode}-${index}`}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No logs yet</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(item.contact.name)}
              </Text>
            </View>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <Text style={styles.name}>{item.contact.name}</Text>
              <Text style={styles.meta}>
                {item.contact.phone} • {item.mode}
              </Text>
            </View>

            {/* Call Icon + Duration */}
            <View style={styles.iconWrapper}>
              {getCallIcon(item.mode)}
              <Text style={styles.duration}>{item.duration}s</Text>
            </View>
          </View>
        )}
        contentContainerStyle={
          callLogs.length === 0 && {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyText: { color: '#888', fontSize: 16, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9ff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  contactInfo: { flex: 1 },
  name: { fontWeight: '700', fontSize: 16, color: '#111' },
  meta: { color: '#888', marginTop: 4, fontSize: 14 },
  iconWrapper: { flexDirection: 'row', alignItems: 'center' },
  duration: { color: '#444', fontWeight: '600', fontSize: 14, marginLeft: 4 },
});

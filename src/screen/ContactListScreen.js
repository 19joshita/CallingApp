import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CallContext } from './../contexts/CallContext';
import contactsData from './../data/contacts';

export default function ContactListScreen({ navigation }) {
  const PAGE = 12;
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const { setIncomingCall } = useContext(CallContext);

  useEffect(() => {
    setList(contactsData.slice(0, PAGE));
    setPage(1);
  }, []);

  const loadMore = () => {
    const next = page + 1;
    const start = page * PAGE;
    const items = contactsData.slice(start, start + PAGE);
    if (items.length === 0) return;
    setList(prev => [...prev, ...items]);
    setPage(next);
  };

  const onCall = contact => {
    navigation.navigate('Call', { contact, mode: 'outgoing' });
  };

  const simulateIncoming = () => {
    const rand = contactsData[Math.floor(Math.random() * contactsData.length)];
    setIncomingCall({ id: Date.now(), contact: rand, status: 'Ringing' });
    navigation.navigate('Incoming');
  };

  const getInitials = name =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

  const renderItem = ({ item }) => (
    <View style={styles.contactRow}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>

      {/* Call Button */}
      <TouchableOpacity style={styles.callButton} onPress={() => onCall(item)}>
        <MaterialIcons name="call" size={18} color="#fff" />
        <Text style={styles.callText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Logs')}
          >
            <Text style={styles.headerBtnText}>Call Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerBtn, styles.simulateBtn]}
            onPress={simulateIncoming}
          >
            <Text style={styles.headerBtnText}>Simulate Incoming</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact List */}
      <FlatList
        data={list}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<View style={{ height: 20 }} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // light theme
  },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  simulateBtn: {
    backgroundColor: '#FF9500',
  },
  headerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  phone: {
    fontSize: 14,
    color: '#888888',
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745', // green button
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  callText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});

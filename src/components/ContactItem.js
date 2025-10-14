import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ContactItem({ contact, onCall }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
      </View>
      <TouchableOpacity onPress={() => onCall(contact)} style={styles.btn}>
        <Text style={styles.btnText}>Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f7f7fb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontWeight: '700', fontSize: 16 },
  phone: { color: '#666', marginTop: 4 },
  btn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '700' },
});

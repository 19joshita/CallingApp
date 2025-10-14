import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function CallControls({
  muted,
  setMuted,
  speakerOn,
  setSpeakerOn,
  endCall,
}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.control} onPress={() => setMuted(!muted)}>
        <Text style={styles.ctext}>{muted ? 'Unmute' : 'Mute'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.control}
        onPress={() => setSpeakerOn(!speakerOn)}
      >
        <Text style={styles.ctext}>
          {speakerOn ? 'Speaker Off' : 'Speaker'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.control, { backgroundColor: '#d33' }]}
        onPress={endCall}
      >
        <Text style={styles.ctext}>End</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  control: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  ctext: { color: '#fff', fontWeight: '700' },
});

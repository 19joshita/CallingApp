import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CallContext } from './../contexts/CallContext';

export default function CallScreen({ navigation, route }) {
  const { contact, mode } = route.params || {};
  const { addCallLog } = useContext(CallContext);

  const [status, setStatus] = useState('Connecting...');
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [secs, setSecs] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setStatus('Ongoing');
      startTimer();
    }, 1500);

    return () => {
      clearTimeout(t);
      stopTimer();
    };
  }, []);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const endCall = () => {
    stopTimer();
    setStatus('Ended');
    const log = {
      id: Date.now(),
      contact,
      mode: mode || 'outgoing',
      duration: secs,
      endedAt: Date.now(),
    };
    addCallLog(log);
    setTimeout(() => navigation.popToTop(), 1000);
  };

  const formatTime = s => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {contact?.image ? (
            <Image source={{ uri: contact.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {contact?.name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </View>

        {/* Caller Info */}
        <Text style={styles.name}>{contact?.name || 'Unknown Caller'}</Text>
        <Text style={styles.phone}>{contact?.phone || ''}</Text>
        <Text style={styles.status}>
          {status === 'Ongoing'
            ? `Ongoing · ${formatTime(secs)}`
            : status === 'Ended'
            ? 'Call Ended'
            : status}
        </Text>

        <View style={{ flex: 1 }} />

        {/* Controls */}
        <View style={styles.controlsWrapper}>
          {/* Mute */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setMuted(!muted)}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name={muted ? 'mic-off' : 'mic'}
                size={28}
                color={muted ? '#1abc9c' : '#888'}
              />
              <Text
                style={[
                  styles.controlText,
                  { color: muted ? '#1abc9c' : '#888' },
                ]}
              >
                {muted ? 'Muted' : 'Unmuted'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={endCall}
          >
            <MaterialIcons name="call-end" size={32} color="#fff" />
          </TouchableOpacity>

          {/* Speaker */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setSpeakerOn(!speakerOn)}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name={speakerOn ? 'volume-up' : 'volume-off'}
                size={28}
                color={speakerOn ? '#1abc9c' : '#888'}
              />
              <Text
                style={[
                  styles.controlText,
                  { color: speakerOn ? '#1abc9c' : '#888' },
                ]}
              >
                {speakerOn ? 'Speaker' : 'Muted'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  avatarContainer: { marginTop: 60, marginBottom: 20 },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 48, color: '#555', fontWeight: '700' },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginTop: 12,
  },
  phone: { fontSize: 16, color: '#666', marginTop: 4 },
  status: { fontSize: 16, color: '#999', marginTop: 12 },
  controlsWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 5,
  },
  controlButton: { justifyContent: 'center', alignItems: 'center' },
  iconWrapper: { alignItems: 'center' },
  controlText: { fontSize: 12, marginTop: 4, fontWeight: '600' },
  endCallButton: {
    backgroundColor: '#e74c3c',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

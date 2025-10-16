import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
  Vibration,
  PermissionsAndroid,
} from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { CallContext } from './../contexts/CallContext';
import Sound from 'react-native-sound';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = 70;
const TRACK_WIDTH = width - 40;
const MAX_SWIPE = (TRACK_WIDTH - BUTTON_SIZE) / 2;
const THRESHOLD = MAX_SWIPE * 0.8;

export default function IncomingCallScreen({ navigation }) {
  const { incomingCall, setIncomingCall, setCurrentCall } =
    useContext(CallContext);
  const translateX = useRef(new Animated.Value(0)).current;
  const ringtoneRef = useRef(null);
  const vibrationIntervalRef = useRef(null);

  // --- Request vibration permission ---
  const requestVibrationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.VIBRATE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('Vibration permission error:', err);
      return false;
    }
  };

  useEffect(() => {
    if (!incomingCall) {
      navigation.goBack();
      return;
    }

    // --- Play ringtone from Android raw folder ---
    try {
      ringtoneRef.current = new Sound(
        'ringtone.mp3',
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.log('Failed to load sound', error);
            return;
          }
          ringtoneRef.current.setNumberOfLoops(-1);
          ringtoneRef.current.play(success => {
            if (!success) console.log('Playback failed');
          });
        },
      );
    } catch (err) {
      console.log('Error initializing ringtone:', err);
    }

    // --- Vibrate if permission granted ---
    requestVibrationPermission().then(granted => {
      if (granted) {
        vibrationIntervalRef.current = setInterval(() => {
          Vibration.vibrate(800);
        }, 1500);
      } else {
        console.log('Vibration permission denied');
      }
    });

    // --- Cleanup on unmount ---
    return () => {
      if (ringtoneRef.current)
        ringtoneRef.current.stop(() => ringtoneRef.current.release());
      if (vibrationIntervalRef.current)
        clearInterval(vibrationIntervalRef.current);
      Vibration.cancel();
    };
  }, [incomingCall]);

  if (!incomingCall) {
    return (
      <View
        style={[styles.bg, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <Text>No incoming call</Text>
      </View>
    );
  }

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onGestureEnd = e => {
    const { translationX } = e.nativeEvent;

    if (translationX > THRESHOLD) {
      // Accept call
      if (ringtoneRef.current)
        ringtoneRef.current.stop(() => ringtoneRef.current.release());
      setCurrentCall({ ...incomingCall, startedAt: Date.now() });
      setIncomingCall(null);
      navigation.replace('Call', {
        contact: incomingCall.contact,
        mode: 'incoming',
      });
    } else if (translationX < -THRESHOLD) {
      // Reject call
      if (ringtoneRef.current)
        ringtoneRef.current.stop(() => ringtoneRef.current.release());
      setIncomingCall(null);
      navigation.goBack();
    } else {
      // Reset swipe button
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const clampedTranslateX = translateX.interpolate({
    inputRange: [-MAX_SWIPE, MAX_SWIPE],
    outputRange: [-MAX_SWIPE, MAX_SWIPE],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/600/1000' }}
        style={styles.bg}
      >
        <View style={styles.overlay} />

        <View style={styles.center}>
          <Text style={styles.label}>Incoming Call</Text>
          <Text style={styles.name}>{incomingCall.contact.name}</Text>
          <Text style={styles.phone}>{incomingCall.contact.phone}</Text>
        </View>

        <View style={styles.swipeArea}>
          <Text style={styles.instr}>Swipe the button to Accept or Reject</Text>

          <View style={styles.track}>
            <View
              style={[
                styles.sideButton,
                { left: 0, backgroundColor: '#FF6B6B' },
              ]}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </View>

            <View
              style={[
                styles.sideButton,
                { right: 0, backgroundColor: '#4CD964' },
              ]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </View>

            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onEnded={onGestureEnd}
            >
              <Animated.View
                style={[
                  styles.swipeButton,
                  { transform: [{ translateX: clampedTranslateX }] },
                ]}
              >
                <Text style={styles.phoneIcon}>📞</Text>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  center: { alignItems: 'center', marginTop: 140 },
  label: { color: '#333', fontSize: 18 },
  name: { color: '#111', fontSize: 34, fontWeight: '800', marginTop: 8 },
  phone: { color: '#555', marginTop: 6, fontSize: 16 },
  swipeArea: { width: width - 40, alignItems: 'center', marginBottom: 80 },
  instr: { color: '#333', marginBottom: 20, fontSize: 16 },
  track: {
    width: '100%',
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#ddd',
    justifyContent: 'center',
  },
  sideButton: {
    position: 'absolute',
    width: 80,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  swipeButton: {
    position: 'absolute',
    left: TRACK_WIDTH / 2 - BUTTON_SIZE / 2,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: { fontSize: 28, color: '#fff' },
});

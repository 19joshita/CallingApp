import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Animated,
} from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { CallContext } from './../contexts/CallContext';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = 70;
const TRACK_WIDTH = width - 40; // total track width
const MAX_SWIPE = (TRACK_WIDTH - BUTTON_SIZE) / 2; // max left/right swipe
const THRESHOLD = MAX_SWIPE * 0.8; // distance to trigger accept/reject

export default function IncomingCallScreen({ navigation }) {
  const { incomingCall, setIncomingCall, setCurrentCall } =
    useContext(CallContext);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!incomingCall) navigation.goBack();
  }, [incomingCall]);

  if (!incomingCall) return null;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onGestureEnd = e => {
    const { translationX } = e.nativeEvent;

    if (translationX > THRESHOLD) {
      // Accept call
      setCurrentCall({ ...incomingCall, startedAt: Date.now() });
      setIncomingCall(null);
      navigation.replace('Call', {
        contact: incomingCall.contact,
        mode: 'incoming',
      });
    } else if (translationX < -THRESHOLD) {
      // Reject call
      setIncomingCall(null);
      navigation.goBack();
    } else {
      // Reset to center
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

            {/* Draggable Swipe Button */}
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onEnded={onGestureEnd}
            >
              <Animated.View
                style={[
                  styles.swipeButton,
                  {
                    transform: [{ translateX: clampedTranslateX }],
                  },
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

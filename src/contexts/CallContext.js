import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Context
export const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null); 
  const [currentCall, setCurrentCall] = useState(null); 
  const [callLogs, setCallLogs] = useState([]);

  const STORAGE_KEY = '@call_logs';

  // Load saved logs when app starts
  useEffect(() => {
    (async () => {
      try {
        const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedLogs) {
          setCallLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error('Error loading call logs:', error);
      }
    })();
  }, []);

  // Automatically persist logs when they change
  useEffect(() => {
    saveLogs(callLogs);
  }, [callLogs]);

  // Save call logs to AsyncStorage
  const saveLogs = async logs => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving call logs:', error);
    }
  };

  //  Add new call log (with timestamp and unique ID)
  const addCallLog = useCallback(log => {
    const newLog = {
      id: Date.now().toString(),
      ...log,
      time: new Date().toISOString(),
    };
    setCallLogs(prev => [newLog, ...prev]);
  }, []);

  // Clear all logs
  const clearCallLogs = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCallLogs([]);
    } catch (error) {
      console.error('Error clearing call logs:', error);
    }
  }, []);

  // Start a call
  const startCall = useCallback(contact => {
    setCurrentCall({
      id: Date.now().toString(),
      contact,
      status: 'ongoing',
      startedAt: new Date().toISOString(),
    });
  }, []);

  // End a call and add it to logs
  const endCall = useCallback(
    (isMissed = false) => {
      if (!currentCall) return;

      const endedAt = new Date().toISOString();
      const duration = Math.floor(
        (new Date(endedAt) - new Date(currentCall.startedAt)) / 1000,
      );

      const callLog = {
        contact: currentCall.contact,
        status: isMissed ? 'missed' : 'completed',
        startedAt: currentCall.startedAt,
        endedAt,
        duration,
      };

      addCallLog(callLog);
      setCurrentCall(null);
    },
    [currentCall, addCallLog],
  );

  //Context value
  const contextValue = {
    incomingCall,
    setIncomingCall,
    currentCall,
    setCurrentCall,
    callLogs,
    addCallLog,
    clearCallLogs,
    startCall,
    endCall,
  };

  return (
    <CallContext.Provider value={contextValue}>{children}</CallContext.Provider>
  );
};

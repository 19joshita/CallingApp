import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CallProvider } from './src/contexts/CallContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <CallProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <RootNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </CallProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;

//  const isDarkMode = useColorScheme() === 'dark';
// <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

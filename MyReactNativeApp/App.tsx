/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {BleManager, Device} from 'react-native-ble-plx';

const bleManager = new BleManager();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [devices, setDevices] = useState<Device[]>([]);
  useEffect(() => {
    const startScan = () => {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
          return;
        }

        if (device) {
          setDevices(currentDevices => [...currentDevices, device]);
        }
      });

      // Stop scanning after a duration
      setTimeout(() => {
        bleManager.stopDeviceScan();
      }, 10000); // Adjust the scanning time as needed
    };

    startScan();

    return () => {
      bleManager.stopDeviceScan();
    };
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        {devices.map((device, index) => (
          <View key={index}>
            <Text>Device Name: {device.name}</Text>
            <Text>Device ID: {device.id}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

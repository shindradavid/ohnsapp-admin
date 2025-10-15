import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';

import { APP_COLORS, APP_SIZES } from '../../lib/constants';

const LoadingScreen = () => (
  <View style={styles.container}>
    <Image source={require('../../../assets/logo.png')} style={styles.logo} />
    <Text style={styles.text}>Loading</Text>
    <ActivityIndicator size="large" color={APP_COLORS.accent1} style={styles.spinner} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  text: {
    fontSize: APP_SIZES.fsLg,
    color: '#000000',
    marginBottom: 12,
    fontWeight: '500',
  },
  spinner: {
    marginTop: 8,
  },
});

export default LoadingScreen;

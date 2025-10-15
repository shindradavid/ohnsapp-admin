import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

import { APP_COLORS, APP_SIZES } from '../../lib/constants';

type MainPageLayout = {
  title: string;
  children: React.ReactNode;
};

const MainPageLayout: React.FC<MainPageLayout> = ({ title = 'Main Page', children }) => {
  const insets = useSafeAreaInsets();
  const appVersion = Constants.expoConfig?.version || 'Unknown';

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLORS.accent1 }}>
      <StatusBar translucent style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.appBarWrapper}>
            <View style={styles.appBar}>
              <DrawerToggleButton tintColor="#fff" />
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: APP_SIZES.fsMd,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginRight: 12,
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: APP_SIZES.fsSm,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginRight: 12,
                  }}
                >
                  v{appVersion}
                </Text>
              </View>

              <Image
                source={require('../../../assets/logo.png')}
                height={46}
                width={46}
                style={{ objectFit: 'contain', height: 46, width: 46, borderRadius: 360 }}
              />
            </View>
          </View>

          <View style={[styles.content]}>{children}</View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBarBackground: {
    backgroundColor: APP_COLORS.bgAccent1,
  },
  container: {
    flex: 1,
  },
  appBarWrapper: {
    backgroundColor: APP_COLORS.bgAccent1,
    color: APP_COLORS.txtPrimaryOnBgAccent1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    ...Platform.select({
      android: {
        elevation: 6,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
    }),
  },
  appBar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  content: {
    flex: 1,
    backgroundColor: APP_COLORS.bgPrimary,
  },
});

export default MainPageLayout;

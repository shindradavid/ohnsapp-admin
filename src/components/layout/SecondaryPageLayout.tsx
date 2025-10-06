import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { APP_COLORS, APP_SIZES } from '../../lib/constants';

type SecondaryPageLayout = {
  title: string;
  children: React.ReactNode;
};

const SecondaryPageLayout: React.FC<SecondaryPageLayout> = ({ title = 'Main Page', children }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: APP_COLORS.accent2 }}>
      <StatusBar translucent style="light" />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.appBarWrapper}>
          <View style={styles.appBar}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>

        <View style={[styles.content]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBarBackground: {
    backgroundColor: APP_COLORS.bgAccent2,
  },
  appBarWrapper: {
    backgroundColor: APP_COLORS.bgAccent2,
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
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 12,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: APP_SIZES.fsLg,
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 32, // Helps center the title visually
  },
  content: {
    flex: 1,
    backgroundColor: APP_COLORS.bgPrimary,
  },
});

export default SecondaryPageLayout;

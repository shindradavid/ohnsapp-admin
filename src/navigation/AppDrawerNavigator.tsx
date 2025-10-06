import React, { useContext } from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { APP_COLORS, APP_SIZES } from '../lib/constants';
import AuthContext from '../context/AuthContext';
import CustomDrawerContent from '../components/CustomDrawer';
import HomeScreen from '../screens/HomeScreen';

const drawerWidth = Dimensions.get('window').width * 0.7;

const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  const { authUser } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerContentContainerStyle: { padding: 0 },
        drawerContentStyle: { padding: 0 },
        drawerActiveTintColor: APP_COLORS.accent1,
        drawerInactiveTintColor: APP_COLORS.darkGrey,
        drawerLabelStyle: {
          fontSize: APP_SIZES.fsBase,
          fontWeight: '500',
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 0,
          marginVertical: 0,
        },
        drawerStyle: {
          backgroundColor: APP_COLORS.white,
          width: drawerWidth,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 3,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default AppDrawerNavigator;

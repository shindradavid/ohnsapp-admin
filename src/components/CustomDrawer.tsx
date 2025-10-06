import React, { useContext } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Entypo, FontAwesome, FontAwesome6, Ionicons, MaterialIcons, Foundation } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerActions } from '@react-navigation/native';

import AuthContext from '../context/AuthContext';
import { APP_COLORS, APP_SIZES } from '../lib/constants';
import { hasRoles } from '../lib/utils';
import { StaffRole } from '../lib/enums';

export default function CustomDrawerContent(props: any) {
  const { user } = useContext(AuthContext);

  const currentRoute = props.state.routeNames[props.state.index];

  const renderDrawerItem = (label: string, routeName: string, IconComponent: React.ElementType, iconName: string) => {
    const focused = currentRoute === routeName;

    return (
      <DrawerItem
        label={label}
        focused={focused}
        onPress={() => props.navigation.dispatch(DrawerActions.jumpTo(routeName))}
        icon={() => (
          <IconComponent name={iconName} size={24} color={focused ? APP_COLORS.txtPrimaryOnBgAccent1 : APP_COLORS.txtPrimaryOnBgPrimary} />
        )}
        labelStyle={[styles.label, focused && { color: APP_COLORS.txtPrimaryOnBgAccent1 }]}
        style={[
          styles.drawerItem,
          focused && {
            backgroundColor: APP_COLORS.bgAccent1,
          },
        ]}
      />
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {user && (
            <View style={styles.profileInfoContainer}>
              <Image source={{ uri: user.photoUrl }} style={styles.profileImage} />
              <View>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.phoneNumber}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.navSection}>
          {renderDrawerItem('Home', 'Home', Ionicons, 'home')}
          {renderDrawerItem('Stock management', 'StockManagement', MaterialIcons, 'inventory')}
          {renderDrawerItem('Expenses', 'Expenses', Foundation, 'graph-pie')}
          {renderDrawerItem('Customers', 'Customers', FontAwesome, 'users')}
          {renderDrawerItem('Suppliers', 'Suppliers', FontAwesome6, 'users-rectangle')}
          {renderDrawerItem('End of day report', 'EndOfDayReport', Foundation, 'graph-bar')}
          {renderDrawerItem('Reports', 'Reports', Foundation, 'graph-pie')}

          {hasRoles(user, [StaffRole.ADMIN, StaffRole.MANAGER]) && (
            <>
              {renderDrawerItem('Sale payments', 'SalePayments', FontAwesome6, 'money-bill')}
              {renderDrawerItem('Staff', 'Staff', FontAwesome6, 'users-gear')}
              {renderDrawerItem('Audit logs', 'AuditLogs', Entypo, 'text-document-inverted')}
            </>
          )}
        </View>
      </ScrollView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContentContainer: {
    flexGrow: 1,
    padding: 0,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 360,
    backgroundColor: APP_COLORS.white,
    marginBottom: APP_SIZES.spacingMd,
    borderWidth: 2,
    borderColor: APP_COLORS.accent1,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: APP_SIZES.spacingSm,
    width: '100%',
    paddingVertical: APP_SIZES.spacingSm,
    paddingHorizontal: APP_SIZES.spacingSm,
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 360,
  },
  profileName: {
    fontSize: APP_SIZES.fsMd,
    fontWeight: '600',
    color: APP_COLORS.txtPrimaryOnBgPrimary,
  },
  profileEmail: {
    fontSize: APP_SIZES.fsBase,
    color: APP_COLORS.txtPrimaryOnBgPrimary,
  },
  navSection: {
    backgroundColor: APP_COLORS.bgPrimary,
    paddingVertical: APP_SIZES.spacingSm,
  },
  drawerItem: {
    marginHorizontal: APP_SIZES.spacingSm,
    borderRadius: APP_SIZES.spacingXs,
    paddingVertical: APP_SIZES.spacingXs,
  },
  drawerLabel: {
    fontSize: APP_SIZES.fsBase,
    fontWeight: '500',
    marginLeft: -APP_SIZES.spacingSm,
    color: APP_COLORS.txtPrimaryOnBgPrimary,
  },
  label: {
    fontSize: APP_SIZES.fsBase,
    fontWeight: '500',
  },
});

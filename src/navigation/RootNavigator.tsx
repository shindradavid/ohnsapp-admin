import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthContext from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import AppDrawerNavigator from './AppDrawerNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loading, authUser } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authUser ? 'Main' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {authUser ? (
          <>
            <Stack.Group>
              <Stack.Screen name="Main" component={AppDrawerNavigator} />
            </Stack.Group>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

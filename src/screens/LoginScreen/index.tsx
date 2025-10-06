import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ToastAndroid } from 'react-native';
import { z, ZodError } from 'zod';

import { CustomButton, CustomPasswordInput, CustomTextInput } from '../../components/common';
import { APP_COLORS, APP_SIZES } from '../../lib/constants';
import { normalizePhoneNumber } from '../../lib/utils';
import authService from '../../services/authService';
import AuthContext from '../../context/AuthContext';
import { APIError } from '../../lib/errors';

const LoginScreen = () => {
  const { setAuthUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);

    try {
      const loginDataSchema = z.object({
        phoneNumber: z
          .string()
          .trim()
          .transform((val, ctx) => {
            try {
              return normalizePhoneNumber(val);
            } catch (err) {
              ctx.addIssue({
                code: 'custom',
                message: 'Invalid phone number format',
              });
              return z.NEVER;
            }
          }),
        password: z.string().min(8).trim(),
      });

      const loginData = loginDataSchema.parse({ phoneNumber: email, password });

      const { user, error } = await authService.loginWithPhoneNumberAndPassword(loginData.phoneNumber, loginData.password);

      if (error) {
        ToastAndroid.showWithGravity('Login failed', ToastAndroid.SHORT, ToastAndroid.CENTER);
        return;
      }

      if (user) {
        setAuthUser(user);
        ToastAndroid.showWithGravity('Login successful', ToastAndroid.SHORT, ToastAndroid.CENTER);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        ToastAndroid.showWithGravity(
          'Validation failed. Please check your input fields.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else if (error instanceof APIError) {
        ToastAndroid.showWithGravity('Login failed', ToastAndroid.SHORT, ToastAndroid.CENTER);
      } else {
        ToastAndroid.showWithGravity('Login failed', ToastAndroid.SHORT, ToastAndroid.CENTER);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/login-bg.jpg')}
        imageStyle={styles.curvedImageStyles}
        style={styles.topSectionBackground}
      >
        <View style={styles.topSectionOverlay}>
          <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        </View>
      </ImageBackground>

      <View style={styles.scrollViewContent}>
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Login</Text>

          <CustomTextInput label="Phone number" keyboardType="phone-pad" value={email} onChangeText={setEmail} />

          <CustomPasswordInput label="Password" value={password} onChangeText={setPassword} />

          <CustomButton title="Login" onPress={handleLogin} disabled={loading} loading={loading} variant="secondary" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.bgSecondary,
  },
  topSectionBackground: {
    height: 380,
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  curvedImageStyles: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topSectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    width: APP_SIZES.spacing10xl,
    height: APP_SIZES.spacing10xl,
    marginBottom: APP_SIZES.spacingMd,
    resizeMode: 'contain',
    borderRadius: 360,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: APP_SIZES.pagePadding,
    marginTop: -APP_SIZES.spacing4xl,
  },
  loginCard: {
    backgroundColor: APP_COLORS.bgPrimary,
    paddingHorizontal: APP_SIZES.spacingLg,
    paddingVertical: APP_SIZES.spacing2xl,
    borderRadius: 12,
    elevation: 12,
    shadowColor: APP_COLORS.black,
    shadowOffset: { width: 0, height: APP_SIZES.spacingSm },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginHorizontal: APP_SIZES.spacingSm,
  },
  cardTitle: {
    fontSize: APP_SIZES.fsXl,
    fontWeight: '700',
    marginBottom: APP_SIZES.spacingXl,
    color: APP_COLORS.accent2,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: APP_SIZES.spacingXl,
  },
});

export default LoginScreen;

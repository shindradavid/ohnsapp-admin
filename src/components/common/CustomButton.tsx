import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { APP_SIZES, APP_COLORS } from '../../lib/constants';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={[styles.text, variant === 'primary' ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  primary: {
    backgroundColor: APP_COLORS.bgAccent1,
  },
  secondary: {
    backgroundColor: APP_COLORS.bgAccent2,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    backgroundColor: '#A0A0A0',
  },
  text: {
    fontSize: APP_SIZES.fsBase,
    fontWeight: 'bold',
  },
  textPrimary: {
    color: APP_COLORS.txtPrimaryOnBgAccent1,
  },
  textSecondary: {
    color: APP_COLORS.txtPrimaryOnBgAccent2,
  },
});

export default CustomButton;

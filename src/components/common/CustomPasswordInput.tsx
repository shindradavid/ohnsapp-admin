import { APP_COLORS, APP_SIZES } from '../../lib/constants';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

// Icon component for the eye icon
const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => {
  return <Text style={styles.iconText}>{open ? '👁️' : '👁️‍🗨️'}</Text>;
};

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  /** Label text to display above the input */
  label?: string;
  /** Error message to display when validation fails */
  error?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input container style */
  inputContainerStyle?: ViewStyle;
  /** Custom input style */
  inputStyle?: TextStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
  /** Custom error text style */
  errorStyle?: TextStyle;
  /** Custom helper text style */
  helperTextStyle?: TextStyle;
  /** Whether to show the password strength indicator */
  showStrengthIndicator?: boolean;
  /** Custom validation function */
  validate?: (value: string) => string | undefined;
  /** Callback when input value changes */
  onChangeText?: (text: string) => void;
  /** Callback when input loses focus */
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

/**
 * A customizable password input component with toggle visibility
 * and optional password strength indicator
 */
const CustomPasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperTextStyle,
  showStrengthIndicator = false,
  validate,
  onChangeText,
  onBlur,
}) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  // Calculate password strength
  const calculateStrength = (value: string): number => {
    if (!value) return 0;

    let strength = 0;

    // Length check
    if (value.length >= 8) strength += 1;
    if (value.length >= 12) strength += 1;

    // Complexity checks
    if (/[A-Z]/.test(value)) strength += 1; // Has uppercase
    if (/[a-z]/.test(value)) strength += 1; // Has lowercase
    if (/[0-9]/.test(value)) strength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(value)) strength += 1; // Has special char

    // Scale to 0-4 range
    return Math.min(4, Math.floor(strength / 1.5));
  };

  // Handle password change
  const handlePasswordChange = (text: string): void => {
    setPassword(text);

    if (touched && validate) {
      setLocalError(validate(text));
    }

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    setTouched(true);
    setIsFocused(false);

    if (validate) {
      setLocalError(validate(password));
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  // Get strength level description
  const getStrengthDescription = (strength: number): string => {
    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Medium';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  // Get color for strength indicator
  const getStrengthColor = (index: number, strength: number): string => {
    if (index > strength) return '#e0e0e0';

    switch (strength) {
      case 0:
        return '#ff5252';
      case 1:
        return '#ff9800';
      case 2:
        return '#ffd600';
      case 3:
        return '#4caf50';
      case 4:
        return '#388e3c';
      default:
        return '#e0e0e0';
    }
  };

  const passwordStrength = calculateStrength(password);
  const displayError = error || localError;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      {helperText && !displayError && <Text style={[styles.helperText, helperTextStyle]}>{helperText}</Text>}

      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          displayError ? styles.inputError : null,
          isFocused && { borderColor: APP_COLORS.accent1, borderWidth: 2 },
        ]}
      >
        <TextInput
          style={[styles.input, inputStyle]}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="oneTimeCode" // Prevents keychain autofill
          value={password}
          onChangeText={handlePasswordChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />

        <TouchableOpacity style={styles.visibilityToggle} onPress={togglePasswordVisibility} activeOpacity={0.7}>
          <EyeIcon open={passwordVisible} />
        </TouchableOpacity>
      </View>

      {showStrengthIndicator && password.length > 0 && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBars}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[styles.strengthBar, { backgroundColor: getStrengthColor(index, passwordStrength) }]}
              />
            ))}
          </View>
          <Text style={styles.strengthText}>{getStrengthDescription(passwordStrength)}</Text>
        </View>
      )}

      {displayError && <Text style={[styles.errorText, errorStyle]}>{displayError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: APP_SIZES.fsBase,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
  },
  inputError: {
    borderColor: '#f44336',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  visibilityToggle: {
    padding: 8,
  },
  iconText: {
    fontSize: 18,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    height: 4,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: '100%',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 4,
  },
});

export default CustomPasswordInput;

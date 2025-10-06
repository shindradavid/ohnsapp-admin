import { APP_COLORS } from '../../lib/constants';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type KeyboardTypeOptions } from 'react-native';

type CustomInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  helpText?: string;
};

const CustomTextInput: React.FC<CustomInputProps> = ({
  label,
  placeholder = '',
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  helpText, // ✅ destructure help text
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, isFocused && { borderColor: APP_COLORS.accent1, borderWidth: 2 }, multiline && styles.textArea]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {helpText && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280', // subtle gray tone
    marginTop: 4,
  },
});

export default CustomTextInput;

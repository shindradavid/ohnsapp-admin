import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, type Control, type FieldValues } from 'react-hook-form';

import { APP_COLORS } from '../../lib/constants';

type NumberInputFieldProps<T extends FieldValues> = {
  name: keyof T;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  helpText?: string;
  rules?: object;
};

export function NumberInputField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '',
  helpText,
  rules = {},
}: NumberInputFieldProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(String(control._formValues[name] ?? ''));

  return (
    <Controller
      control={control}
      name={name as any}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        // keep internal sync between form value and local text state
        React.useEffect(() => {
          // Syncs the RHF value back to the TextInput if it changes externally
          if (value !== undefined && value !== null && String(value) !== localValue) {
            setLocalValue(String(value));
          } else if ((value === undefined || value === null) && localValue !== '') {
            // Handles form reset scenarios
            setLocalValue('');
          }
        }, [value]);

        const handleChangeText = (text: string) => {
          // allow empty string or valid partial numbers (e.g., "0.", "-")
          if (text === '' || /^-?\d*\.?\d*$/.test(text)) {
            setLocalValue(text);
          }
        };

        const handleBlur = () => {
          setIsFocused(false);
          onBlur();

          // convert string to number on blur
          const numericValue = localValue.trim() === '' ? null : Number(localValue);
          onChange(isNaN(numericValue as number) ? null : numericValue);
        };

        return (
          <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TextInput
              style={[
                styles.input,
                isFocused && { borderColor: APP_COLORS.accent1, borderWidth: 2 },
                error && { borderColor: APP_COLORS.error },
              ]}
              placeholder={placeholder}
              value={localValue}
              onChangeText={handleChangeText}
              keyboardType="decimal-pad"
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
            />

            {error ? (
              <Text style={styles.errorText}>{error.message}</Text>
            ) : helpText ? (
              <Text style={styles.helpText}>{helpText}</Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}

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
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: APP_COLORS.error,
    marginTop: 4,
  },
});

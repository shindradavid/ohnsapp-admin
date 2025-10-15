import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type KeyboardTypeOptions } from 'react-native';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { APP_COLORS } from '../../lib/constants';

type TextInputFieldProps<T extends FieldValues> = {
  name: keyof T;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  helpText?: string;
  rules?: object;
};

export function TextInputField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '',
  keyboardType = 'default',
  multiline = false,
  helpText,
  rules = {},
}: TextInputFieldProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name as any}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}

          <TextInput
            style={[
              styles.input,
              isFocused && { borderColor: APP_COLORS.accent1, borderWidth: 2 },
              error && { borderColor: APP_COLORS.error },
              multiline && styles.textArea,
            ]}
            placeholder={placeholder}
            value={value !== null ? value?.toString() : ''}
            onChangeText={(text) => {
              if (keyboardType === 'numeric') {
                // convert to number but handle empty or invalid input safely
                const numericValue = text === '' ? null : Number(text);

                onChange(isNaN(numericValue as number) ? null : numericValue);
              } else {
                onChange(text);
              }
            }}
            keyboardType={keyboardType}
            multiline={multiline}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur();
            }}
          />

          {error ? (
            <Text style={styles.errorText}>{error.message}</Text>
          ) : helpText ? (
            <Text style={styles.helpText}>{helpText}</Text>
          ) : null}
        </View>
      )}
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { APP_COLORS } from '../../lib/constants';

type CustomMultiSelectFieldProps = {
  label?: string;
  placeholder?: string;
  items: { id: string; name: string }[];
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
};

const CustomMultiSelectField: React.FC<CustomMultiSelectFieldProps> = ({
  label,
  items,
  selectedItems,
  placeholder = 'Select...',
  onSelectedItemsChange,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <SectionedMultiSelect
        items={items}
        //@ts-ignore
        IconRenderer={MaterialIcons}
        uniqueKey="id"
        selectText={placeholder}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        styles={{
          selectToggle: styles.input,
          chipContainer: styles.chip,
          chipText: styles.chipText,
        }}
      />
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
  chip: {
    backgroundColor: APP_COLORS.accent1,
    color: APP_COLORS.txtPrimaryOnBgAccent1,
  },
  chipText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  chipIcon: {
    color: '#ffffff',
  },
});

export default CustomMultiSelectField;

import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CustomSelectInput = ({ placeholder, label, items, value, onValueChange, helpText = '' }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={styles.selectInput}>
        <RNPickerSelect
          value={value}
          onValueChange={onValueChange}
          items={items}
          placeholder={{ label: placeholder, value: null, color: '#9e9e9e' }} // Added color to placeholder
          style={{
            inputIOS: styles.pickerInputIOS,
            inputAndroid: styles.pickerInputAndroid,
            iconContainer: styles.iconContainer, // Style the icon container
          }}
          useNativeAndroidPickerStyle={false} // Recommended for consistent styling
          // You can pass props to the underlying native picker if needed, e.g., for accessibility
          // pickerProps={{
          //   accessibilityLabel: label,
          // }}
        />
        {/* Optional: Add a custom arrow icon if the default isn't visible or styled */}
        {/* <View style={styles.arrowIcon}>
          <Text>▼</Text>
        </View> */}
      </View>
      {helpText && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Add some space below the component
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333', // Darker label for better contrast
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    // Changed to a fixed height for better iOS compatibility
    height: 50, // A common height for input fields
    justifyContent: 'center', // Vertically center content
    paddingHorizontal: 12, // Inner padding
  },
  pickerInputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333', // Text color for selected value
    paddingRight: 30, // To ensure text doesn't overlap with the arrow icon
  },
  pickerInputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333', // Text color for selected value
    paddingRight: 30, // To ensure text doesn't overlap with the arrow icon
  },
  iconContainer: {
    top: 15, // Adjust icon vertical position
    right: 12, // Adjust icon horizontal position
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  // If you want to add a custom arrow icon, uncomment the optional View in the component
  // arrowIcon: {
  //   position: 'absolute',
  //   right: 15,
  //   top: '50%',
  //   marginTop: -7, // Half of font size to center vertically
  // },
});

export default CustomSelectInput;

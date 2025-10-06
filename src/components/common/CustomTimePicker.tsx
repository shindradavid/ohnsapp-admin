import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { format } from 'date-fns';

interface CustomTimePickerProps {
  /** Initial date to display */
  initialDate?: Date;
  /** Callback function when date changes */
  onDateChange?: (date: string) => void;
  /** Label for the date picker */
  label?: string;
  /** Format for the displayed date */
  format?: string;
  /** Additional style for container */
  containerStyle?: ViewStyle;
  /** Additional style for label */
  labelStyle?: TextStyle;
  /** Additional style for date display */
  dateDisplayStyle?: TextStyle;
  is24Hour?: boolean;
}

/**
 * Custom DatePicker component for React Native with Expo
 */
const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  initialDate = new Date(),
  onDateChange,
  label = 'Select Time',
  format: dateFormat = 'yyyy-MM-dd',
  containerStyle,
  labelStyle,
  dateDisplayStyle,
  is24Hour = false,
}) => {
  const [time, setTime] = useState<Date>(initialDate);
  const [show, setShow] = useState<boolean>(false);

  const getTime = (date: Date) => {
    return date.toISOString().split('T')[1];
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    const currentDate = selectedDate || time;
    setShow(Platform.OS === 'ios'); // Keep picker open on iOS
    setTime(currentDate);

    if (onDateChange && selectedDate) {
      onDateChange(getTime(currentDate));
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable onPress={() => setShow(true)} style={styles.dateDisplay}>
        <Text style={[styles.dateText, dateDisplayStyle]}>{format(time, 'hh:mm aa')}</Text>
      </Pressable>

      {show && <DateTimePicker testID="dateTimePicker" value={time} mode="time" onChange={onChange} is24Hour={is24Hour} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateDisplay: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
});

export default CustomTimePicker;

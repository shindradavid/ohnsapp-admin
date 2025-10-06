import React, { useState } from 'react';
import { View, Text, Platform, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { APP_COLORS } from '../../lib/constants';

interface CustomDatePickerProps {
  /** Initial date to display */
  initialDate?: Date;
  /** Callback function when date changes */
  onDateChange?: (date: Date) => void;
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
  paddingHorizontal?: number;
  paddingVertical?: number;
}

/**
 * Custom DatePicker component for React Native with Expo
 */
const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  initialDate = new Date(),
  onDateChange,
  label,
  format: dateFormat = 'yyyy-MM-dd',
  containerStyle,
  labelStyle,
  dateDisplayStyle,
  paddingHorizontal = 10,
  paddingVertical = 10,
}) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [show, setShow] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    if (onDateChange && selectedDate) {
      onDateChange(currentDate);
    }
  };

  const showDatepicker = (): void => {
    setShow(true);
  };

  const formattedDate: string = format(date, 'LLLL do yyyy');

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable onPress={showDatepicker} style={[styles.dateDisplay, { paddingHorizontal, paddingVertical }]}>
        <Text style={[styles.dateText, dateDisplayStyle]}>{formattedDate}</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          accentColor={APP_COLORS.accent2}
          testID="dateTimePicker"
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
});

export default CustomDatePicker;

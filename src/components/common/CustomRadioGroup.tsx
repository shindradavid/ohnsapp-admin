import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import { APP_COLORS } from '../../lib/constants';

import type { RadioOption } from '../../lib/types';

// Interface for RadioGroup props
interface CustomRadioGroupProps {
  /** Array of radio options to display */
  options: RadioOption[];
  /** Currently selected option ID */
  selectedId?: string | number | null;
  /** Callback when selection changes */
  onSelect: (option: RadioOption) => void;
  /** Direction to arrange radio buttons (default: 'vertical') */
  direction?: 'vertical' | 'horizontal';
  /** Custom container styles */
  containerStyle?: ViewStyle;
  /** Custom styles for individual radio option containers */
  optionContainerStyle?: ViewStyle;
  /** Custom radio button outer circle style */
  radioOuterStyle?: ViewStyle;
  /** Custom radio button inner circle style (selected indicator) */
  radioInnerStyle?: ViewStyle;
  /** Custom label text style */
  labelStyle?: TextStyle;
  /** Custom style for selected label */
  selectedLabelStyle?: TextStyle;
  /** Custom style for disabled options */
  disabledStyle?: ViewStyle;
  /** Size of the radio button (default: 20) */
  size?: number;
  /** Main color theme of the radio buttons (default: '#2196F3') */
  color?: string;
  /** Display a required asterisk next to group label */
  required?: boolean;
  /** Group label text */
  label?: string;
  /** Group label style */
  groupLabelStyle?: TextStyle;
}

/**
 * A customizable radio button group component for React Native
 */
const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  options,
  selectedId = null,
  onSelect,
  direction = 'vertical',
  containerStyle,
  optionContainerStyle,
  radioOuterStyle,
  radioInnerStyle,
  labelStyle,
  selectedLabelStyle,
  disabledStyle,
  size = 24,
  color = APP_COLORS.accent1,
  required = false,
  label,
  groupLabelStyle,
}) => {
  // Determine if the options should be arranged horizontally or vertically
  const isHorizontal = direction === 'horizontal';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.groupLabel, groupLabelStyle]}>
          {label}
          {required && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
      )}

      <View style={[styles.optionsContainer, isHorizontal ? styles.horizontalContainer : styles.verticalContainer]}>
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isDisabled = option.disabled;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionContainer,
                isHorizontal ? styles.horizontalOption : styles.verticalOption,
                optionContainerStyle,
                isDisabled && [styles.disabledOption, disabledStyle],
              ]}
              onPress={() => {
                if (!isDisabled) {
                  onSelect(option);
                }
              }}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioOuter,
                  {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor: isDisabled ? '#d3d3d3' : color,
                  },
                  radioOuterStyle,
                ]}
              >
                {isSelected && (
                  <View
                    style={[
                      styles.radioInner,
                      {
                        width: size / 2,
                        height: size / 2,
                        borderRadius: size / 4,
                        backgroundColor: isDisabled ? '#d3d3d3' : color,
                      },
                      radioInnerStyle,
                    ]}
                  />
                )}
              </View>
              <Text style={[styles.label, labelStyle, isSelected && selectedLabelStyle, isDisabled && styles.disabledLabel]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: 'red',
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalOption: {
    marginVertical: 6,
  },
  horizontalOption: {
    marginRight: 16,
    marginVertical: 6,
  },
  radioOuter: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {},
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  disabledOption: {
    opacity: 0.6,
  },
  disabledLabel: {
    color: '#999',
  },
});

export default CustomRadioGroup;

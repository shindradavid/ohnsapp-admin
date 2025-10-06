import React, { useState, useRef } from 'react';
import { View, Animated, Pressable, Text, StyleProp, TextStyle } from 'react-native';

interface CustomSwitchProps {
  initialValue?: boolean;
  onToggle?: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  width?: number;
  height?: number;
  circleSize?: number;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  labelPosition?: 'left' | 'right'; // currently unused
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  initialValue = false,
  onToggle,
  activeColor = '#4CAF50',
  inactiveColor = '#CCCCCC',
  width = 50,
  height = 30,
  circleSize = 26,
  label = '',
  labelStyle = {},
  labelPosition = 'right',
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialValue);
  const switchTranslate = useRef<Animated.Value>(new Animated.Value(initialValue ? 1 : 0)).current;

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    Animated.timing(switchTranslate, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (onToggle) {
      onToggle(newValue);
    }
  };

  const interpolatedTranslateX = switchTranslate.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - circleSize - 2],
  });

  const defaultLabelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  };

  const mergedLabelStyle = [defaultLabelStyle, labelStyle];

  return (
    <>
      {label && <Text style={mergedLabelStyle}>{label}</Text>}

      <Pressable onPress={toggleSwitch} style={{ marginBottom: 8 }}>
        <View
          style={{
            width,
            height,
            backgroundColor: isEnabled ? activeColor : inactiveColor,
            borderRadius: height / 2,
            justifyContent: 'center',
            padding: 2,
          }}
        >
          <Animated.View
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: 'white',
              transform: [{ translateX: interpolatedTranslateX }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          />
        </View>
      </Pressable>
    </>
  );
};

export default CustomSwitch;

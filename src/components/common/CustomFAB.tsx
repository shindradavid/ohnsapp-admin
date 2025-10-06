import React from 'react';

import { Pressable } from 'react-native';

import { MaterialIcons, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

import { APP_COLORS } from '../../lib/constants';

type IconLibrary = 'MaterialIcons' | 'Ionicons' | 'FontAwesome' | 'Feather';

type CustomFABProps = {
  onPress: () => void;
  icon?: string;
  iconLibrary?: IconLibrary;
};

const CustomFAB: React.FC<CustomFABProps> = ({ onPress, icon = 'add', iconLibrary: iconLibrary = 'MaterialIcons' }) => {
  let IconComponent;

  switch (iconLibrary) {
    case 'Ionicons':
      IconComponent = Ionicons;
      break;
    case 'FontAwesome':
      IconComponent = FontAwesome;
      break;
    case 'Feather':
      IconComponent = Feather;
      break;
    default:
      IconComponent = MaterialIcons;
  }

  return (
    <Pressable
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: APP_COLORS.bgAccent1,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
      }}
      onPress={onPress}
    >
      <IconComponent name={icon as any} size={24} color={APP_COLORS.txtPrimaryOnBgAccent1} />
    </Pressable>
  );
};

export default CustomFAB;

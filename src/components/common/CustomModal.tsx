import React, { useRef, useEffect } from 'react';
import {
  View,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { APP_COLORS, APP_SIZES } from '../../lib/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdropPress?: boolean;
  showCloseButton?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  animationType?: 'slide' | 'fade' | 'none';
  footer?: React.ReactNode;
  footerStyle?: ViewStyle;
  width?: number;
  avoidKeyboard?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  children,
  closeOnBackdropPress = true,
  showCloseButton = true,
  containerStyle,
  headerStyle,
  titleStyle,
  contentStyle,
  animationType = 'fade',
  footer,
  footerStyle,
  width = 0.9,
  avoidKeyboard = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const modalContent = (
    <View style={styles.centeredView}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            width: screenWidth * width,
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
          containerStyle,
        ]}
      >
        {showCloseButton && (
          <TouchableOpacity style={styles.floatingCloseButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        )}

        {title && (
          <View style={[styles.header, headerStyle]}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          </View>
        )}

        <View style={[styles.content, contentStyle]}>{children}</View>

        {footer && <View style={[styles.footer, footerStyle]}>{footer}</View>}
      </Animated.View>
    </View>
  );

  return (
    <RNModal transparent visible={visible} onRequestClose={onClose} statusBarTranslucent>
      {avoidKeyboard ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          {modalContent}
        </KeyboardAvoidingView>
      ) : (
        modalContent
      )}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 15,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    padding: APP_SIZES.pagePadding,
  },
  floatingCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#eee',
    borderRadius: 999,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#333',
  },
  header: {
    backgroundColor: APP_COLORS.accent2,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

export default CustomModal;

import { APP_SIZES } from '../../lib/constants';
import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

interface CustomConfirmationModalProps {
  visible: boolean;
  title: string;
  message?: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const CustomConfirmationModal = ({
  visible,
  title,
  message,
  isPending,
  onCancel,
  onConfirm,
}: CustomConfirmationModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable onPress={onConfirm} style={styles.confirmButton} disabled={isPending}>
              {isPending ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.confirmText}>Confirm</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: APP_SIZES.fsMd,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: 'gray',
    fontSize: APP_SIZES.fsBase,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 10,
  },
  cancelText: {
    color: '#333',
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
  },
  confirmText: {
    color: 'white',
  },
});

export default CustomConfirmationModal;

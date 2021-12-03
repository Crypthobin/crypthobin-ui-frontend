import { View } from "native-base";
import React from "react"

import { Modal as _Modal, StyleSheet, TouchableWithoutFeedback } from "react-native"

export default function Modal ({ children, open, modalDidClose, modalStyle }) {
  return (
    <_Modal visible={open} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={modalDidClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View style={modalStyle || {}}>
          {children}
        </View>
      </View>
    </_Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    margin: '5%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});



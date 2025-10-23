import React from "react";
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { STATIC_URL } from "@/src/api";

interface ImagePopupProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImagePopup({ visible, imageUrl, onClose }: ImagePopupProps) {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 600;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.popupContainer,
            isMobile ? { width: "90%", height: "70%" } : { width: "60%", height: "80%" },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {imageUrl ? (
            <Image
              source={{
		   	    uri: imageUrl?.startsWith("/uploads/")
				  ? `${STATIC_URL}${imageUrl}`
				  : imageUrl,
			  }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.placeholder}>Imagem indisponível</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    color: "#666",
    fontSize: 14,
  },
});

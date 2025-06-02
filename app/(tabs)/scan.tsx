import { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Platform, View, Text, Modal, Pressable, Button, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { openSettings } from "expo-linking";
import 'react-native-reanimated';
import { useAuth } from '../../context/auth-context';

// interface Code {
//   url: string;
//   token: string;
// }

export default function ScanScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const { token, logout } = useAuth();

  const alertShown = useRef(false);

  const handleCameraPermission = async () => {
    const permissionResult = await requestPermission();
    if (permissionResult.granted) {
      setIsModalVisible(true);
      setScanned(false);
    } else {
      Alert.alert("Permission Denied", "Camera permission is required.");
    }
  };

  const sendPresence = async (presenceToken: string) => {
    if (!token) {
      if (!alertShown.current) {
        alertShown.current = true;
        Alert.alert('Erreur', 'Code invalide', [
          { text: 'OK', onPress: () => { alertShown.current = false; } }
        ]);
      }
      return;
    }
    try {
      const response = await fetch("http://" + process.env.EXPO_PUBLIC_IP_ADDRESS + ":" + process.env.EXPO_PUBLIC_APP_PORT + "/api/presence/mark", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          "session_token": presenceToken.toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (!alertShown.current) {
          alertShown.current = true;
          Alert.alert('Erreur', data.message || 'Échec de l\'émargement', [
            { text: 'OK', onPress: () => { alertShown.current = false; } }
          ]);
        }
      } else {
        if (!alertShown.current) {
          alertShown.current = true;
          Alert.alert('Info', data.message || 'Émargement réussi', [
            { text: 'OK', onPress: () => { alertShown.current = false; } }
          ]);
        }
      }
    } catch (error) {
      if (!alertShown.current) {
        alertShown.current = true;
        Alert.alert('Erreur réseau', 'Impossible de joindre le serveur', [
          { text: 'OK', onPress: () => { alertShown.current = false; } }
        ]);
      }
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    try {
      if (data) {
        setScanned(true);
        setCode(data);
        setIsModalVisible(false);
        sendPresence(data);
      } else {
        Alert.alert('QR invalide');
      }
    } catch {
      Alert.alert('QR invalide');
    }

    // Autoriser un nouveau scan après 3 secondes
    setTimeout(() => setScanned(false), 3000);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setScanned(false);
  };

  return (
    <View>
      <Text>Bienvenue</Text>
      <Button onPress={handleCameraPermission} title='camera'></Button>
      <Pressable onPress={openSettings}>
        <Text>Ouvrir les paramètres</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={closeModal}
        />
        <View style={styles.modalContent}>
          <Pressable
            onPress={closeModal}
            style={styles.modalClose}
          />
          <CameraView
            style={{ flex: 1, borderRadius: 18 }}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>
      </Modal>

      <Pressable onPress={logout}>
        <Text>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modalClose: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    zIndex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 20,
    right: 20,
  },
  modalContent: {
    height: "80%",
    width: "100%",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
  },
});

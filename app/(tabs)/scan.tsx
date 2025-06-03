import { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, View, Text, Modal, Pressable, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { openSettings } from "expo-linking";
import 'react-native-reanimated';
import { useAuth } from '../../context/auth-context';
import { Icon } from 'react-native-elements';


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
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/icon.png')} style={styles.icon}></Image>
          <Text style={styles.title}>Bienvenue sur Edusign</Text>
        </View>

        <Pressable style={styles.scanButton} onPress={handleCameraPermission}>
          <Icon
            name='qr-code-outline'
            type='ionicon'
            size={100}
            color='white'
          />
          <Text style={styles.scanText}>Signer</Text>
        </Pressable>

        {/* <Button onPress={handleCameraPermission} title='camera' buttonStyle={styles.mainButton} titleStyle={{ color: "black" }}>


        </Button> */}
        <Pressable onPress={openSettings}>
          <Text style={styles.settingsText}>Cliquez ici pour ouvrir les paramètres et autoriser la caméra</Text>
        </Pressable>
      </View>


      <Pressable onPress={logout} style={styles.logout}>
        <Text style={{
          color: "white",
        }}>Se déconnecter</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={closeModal}
        />
        <View style={styles.modalContent}>
          <Pressable
            onPress={closeModal}
            style={styles.modalClose}
          >
          <Icon
            name='close-outline'
            type='ionicon'
            size={30}
            color='white'
          ></Icon>
          </Pressable>

          <View style={styles.scanHelper} />
          
          <CameraView
            style={{ flex: 1, borderRadius: 18 }}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
  },
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
  scanHelper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
    right: 0,
    width: 300,
    height: 300,
    zIndex: 1,
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    paddingVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
  mainButton: {
    backgroundColor: '#f8ac32',
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanButton: {
    backgroundColor: '#f8ac32',
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    aspectRatio: 1,
  },
  scanText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 5,
  },
  settingsText: {
    color: '#4ca4c2',
    textAlign: 'center',
  },
  logout: {
    backgroundColor: "crimson",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

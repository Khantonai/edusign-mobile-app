import { useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, Modal, Pressable, Button } from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useCodeScanner,
} from "react-native-vision-camera";
import { openSettings } from "expo-linking";

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(true);
  const [code, setCode] = useState("");


  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back')

  const handleCameraPermission = async () => {
    console.log("handleCameraPermission");
    if (!hasPermission) {
      if ((await requestPermission()) === false) {
        console.log("Permission denied");
        setCameraPermission(false);
      } else {
        setIsModalVisible(true);
        setCameraPermission(true);
      }
    } else {
      setIsModalVisible(true);
      setCameraPermission(true);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      setCode(codes[0].value as string);
      console.log(codes[0].value);
      setIsModalVisible(false);
    },
  });


  return (
    <View>
      <Text>Salut</Text>
      <Button onPress={handleCameraPermission} title='camera'></Button>
      <Pressable onPress={openSettings}>
        <Text>
          Ouvrir les paramètres
        </Text>
      </Pressable>
      <Text>{code}</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setIsModalVisible(false);
          }}
        />
        <View style={styles.modalContent}>
          <Pressable
            onPress={() => setIsModalVisible(false)}
            style={styles.modalClose}
          />
          <Camera
            style={{ flex: 1, borderRadius: 18 }}
            device={device as any}
            isActive={isModalVisible}
            photoQualityBalance={"speed"}
          codeScanner={codeScanner}
          />
        </View>
      </Modal>
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

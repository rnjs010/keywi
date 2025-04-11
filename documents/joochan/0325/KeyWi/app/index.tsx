import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  AppState,
} from "react-native";
import { WebView, type WebView as WebViewType } from "react-native-webview";

const MyWebView = () => {
  const webViewRef = useRef<WebViewType>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setShowExitModal(false);
        fadeAnim.setValue(0);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        } else {
          setShowExitModal(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, [canGoBack]);

  const handleExit = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowExitModal(false);
      BackHandler.exitApp();
    });
  };

  const handleCancel = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowExitModal(false));
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://keywi.poloceleste.site" }}
        style={styles.webview}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />

      <Modal transparent visible={showExitModal} animationType="fade">
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Image
              source={require("../assets/images/react-logo.png")}
              style={styles.logo}
            />
            <Text style={styles.modalText}>앱을 종료할까요? 🥝</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancel]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>아니요!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirm]}
                onPress={handleExit}
              >
                <Text style={styles.buttonText}>종료할래요</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fffdfd",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#f2f2f2",
  },
  confirm: {
    backgroundColor: "#ff6b6b",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
});

export default MyWebView;

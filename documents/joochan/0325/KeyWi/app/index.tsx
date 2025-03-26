import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const MyWebView = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://keywi.poloceleste.site" }}
        style={styles.webview}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      />
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
});

export default MyWebView;

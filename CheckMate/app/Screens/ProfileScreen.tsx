import ScreenWrapper from "@/components/ScreenWrapper";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.text}>Profil Sayfası</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, fontWeight: "600", color: "#6366F1" },
});

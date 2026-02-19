import React, { JSX } from "react";
import { View, Text, StyleSheet } from "react-native";

type CustomHeaderProps = {
  user: string;
  leftNode?: JSX.Element;
  rightNode?: JSX.Element;
  headerText?: string;
};




const CustomHeader = ({ user }: CustomHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.username}>Merhaba, {user} 👋</Text>
      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
  },
  bottomLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default CustomHeader;

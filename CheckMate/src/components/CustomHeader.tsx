import { theme } from "@/src/constants";
import { useTodoStore } from "@/src/services/useTodoStore";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  user: string;
  title?: string; 
  isHome?: boolean; 
};

export default function CustomHeader({ user, title, isHome = true }: Props) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const userImage = useTodoStore((state) => state.userImage);

  const userDesign = useMemo(() => {
    const initials = user.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    const colors = ["#6C63FF", "#FF6584", "#43D9AD", "#F7A74B", "#3B82F6"];
    const colorIndex = user.length % colors.length;
    return { initials, color: colors[colorIndex] };
  }, [user]);

  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top + 10 } 
    ]}>

      <View style={styles.leftSection}>
        {!isHome && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={{ fontSize: 24 }}>←</Text> 
          </TouchableOpacity>
        )}
        
        {isHome ? (
          <View>
            <Text style={styles.welcomeText}>Merhaba 👋</Text>
            <Text style={styles.userName} numberOfLines={1}>{user}</Text>
          </View>
        ) : (
          <Text style={styles.pageTitle}>{title}</Text>
        )}
      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Profile")} 
        activeOpacity={0.7}
      >
        <View style={[styles.avatarFrame, { borderColor: userImage ? theme.colors.primary : "white" }]}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.initialsCircle, { backgroundColor: userDesign.color }]}>
              <Text style={styles.initialsText}>{userDesign.initials}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  welcomeText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.textPrimary,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  backButton: {
    paddingRight: 8,
  },
  avatarFrame: {
    width: 48,
    height: 48,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: theme.colors.primary,
  },
  avatarImage: { width: "100%", height: "100%" },
  initialsCircle: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  initialsText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
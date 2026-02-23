import CustomInput from "@/src/components/CustomInputText";
import NiceButton, { ButtonStatus } from "@/src/components/NiceButton";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Login({ navigation, route }: any) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<ButtonStatus>("default");
  const insets = useSafeAreaInsets();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 10,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("USERNAME");
      if (storedUser && !route?.params?.logout) {
        navigation.replace("Home", { user: storedUser });
      }
    };
    checkUser();
  }, [
    formAnim,
    formSlide,
    logoAnim,
    logoScale,
    navigation,
    route?.params?.logout,
    textAnim,
    textSlide,
  ]);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("Hata", "Lütfen kullanıcı adı giriniz");
      return;
    }
    try {
      setStatus("loading");
      await AsyncStorage.setItem("USERNAME", username);
      setTimeout(() => {
        setStatus("default");
        navigation.replace("Home", { user: username });
      }, 600);
    } catch (error) {
      setStatus("default");
      Alert.alert("Hata", "Bir şeyler yanlış gitti!");
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.logoWrapper,
              { opacity: logoAnim, transform: [{ scale: logoScale }] },
            ]}
          >
            <View style={styles.logoBg}>
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                size={48}
                color="#fff"
              />
            </View>
            {/* Dekoratif halkalar */}
            <View
              style={[styles.ring, { borderColor: "rgba(99,102,241,0.2)" }]}
            />
            <View
              style={[
                styles.ringOuter,
                { borderColor: "rgba(99,102,241,0.1)" },
              ]}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.titleWrapper,
              { opacity: textAnim, transform: [{ translateY: textSlide }] },
            ]}
          >
            <Text style={styles.appName}>CheckMate</Text>
            <Text style={styles.appTagline}>Görevlerini kolayca takip et</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.form,
            { opacity: formAnim, transform: [{ translateY: formSlide }] },
          ]}
        >
          <Text style={styles.formTitle}>Hoş Geldin 👋</Text>
          <Text style={styles.formSubtitle}>Kullanıcı adınla devam et</Text>

          <View style={styles.inputContainer}>
            <CustomInput
              placeholder="Kullanıcı adını gir"
              value={username}
              onChangeText={setUsername}
              maxLength={15}
              error={username.length > 15 ? "En fazla 15 karakter" : undefined}
            />
          </View>

          <NiceButton title="Giriş Yap" status={status} onPress={handleLogin} />

          <Text style={styles.hint}>
            Hesap gerekmez — sadece bir isim yeterli ✨
          </Text>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  // Hero
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  logoWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  logoBg: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: width * 0.08,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  ring: {
    position: "absolute",
    width: width * 0.42,
    height: width * 0.42,
    borderRadius: width * 0.21,
    borderWidth: 2,
  },
  ringOuter: {
    position: "absolute",
    width: width * 0.56,
    height: width * 0.56,
    borderRadius: width * 0.28,
    borderWidth: 2,
  },
  titleWrapper: {
    alignItems: "center",
    gap: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -1,
  },
  appTagline: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Form
  form: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 28,
    marginHorizontal: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    gap: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    marginVertical: 4,
  },
  hint: {
    fontSize: 12,
    color: "#C4C9D4",
    textAlign: "center",
    marginTop: 4,
  },
});

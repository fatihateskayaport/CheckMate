import CustomInput from "@/components/CustomInputText";
import ScreenWrapper from "@/components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "../../components/CustomText";
import NiceButton, { ButtonStatus } from "../../components/niceButton";
import { centerContainer, screenContainer } from "../../constants/styles";

export default function Login({ navigation, route }: any) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<ButtonStatus>("default");
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("USERNAME");
      if (storedUser && !route?.params?.logout) {
        navigation.replace("Home", { user: storedUser });
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!username) {
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
    <View style={[screenContainer, { paddingTop: insets.top }]}>
      <ScreenWrapper>
        <View style={centerContainer}>
          <CustomText
            size="large"
            style={{ marginBottom: 10, fontWeight: "800" }}
          >
            Hoş Geldin!
          </CustomText>
          <CustomText size="small" style={{ marginBottom: 20 }}>
            Lütfen giriş yapınız.
          </CustomText>

          <CustomInput
            placeholder="Kullanıcı adınızı girin"
            value={username}
            onChangeText={setUsername}
            maxLength={15}
            error={username.length > 15 ? "Todo çok uzun!" : undefined}
          />

          <NiceButton title="Giriş Yap" status={status} onPress={handleLogin} />
        </View>
      </ScreenWrapper>
    </View>
  );
}

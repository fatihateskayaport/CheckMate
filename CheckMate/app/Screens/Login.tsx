import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, TextInput, View } from "react-native";
import CustomText from "../../components/CustomText";
import NiceButton, { ButtonStatus } from "../../components/niceButton";
import { container } from "../../constants/styles";

export default function Login({ navigation, route }: any) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<ButtonStatus>("default");

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
    <View
      style={container({
        flex: 1,
        justify: "center",
        align: "center",
        padding: 24,
      })}
    >
      <CustomText size="large" style={{ marginBottom: 10, fontWeight: "800" }}>
        Hoş Geldin!
      </CustomText>
      <CustomText size="small" style={{ marginBottom: 20 }}>
        Lütfen giriş yapınız.
      </CustomText>

      <TextInput
        placeholder="Kullanıcı adınızı girin"
        value={username}
        onChangeText={setUsername}
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      />

      <NiceButton title="Giriş Yap" status={status} onPress={handleLogin} />
    </View>
  );
}

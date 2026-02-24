import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  iconName?: keyof typeof Ionicons.glyphMap;
  onIconPress?: (event: GestureResponderEvent) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  iconName,
  onIconPress,
}) => {
  return (
    
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          style={[
            styles.input,
            multiline && { height: numberOfLines * 24 },
            error && styles.inputError,
            iconName && { paddingRight: 4 },
          ]}
          placeholderTextColor="#999"
        />
        {maxLength && (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        )}

        {iconName && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconWrapper}>
            <Ionicons name={iconName} size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  inputWrapper: {
    width: Dimensions.get("screen").width * 0.8,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    paddingRight: 38,
    color: "#333",
  },
  inputError: {
    borderColor: "#ff4d4d",
  },
  iconWrapper: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4d4d",
    marginTop: 4,
    fontSize: 12,
  },
  charCount: {
    position: "absolute",
    bottom: 16,
    right: 20,
    fontSize: 11,
    color: "#bbb",
    paddingLeft: 4,
  },
});

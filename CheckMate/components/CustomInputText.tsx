import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        {iconName && (
          <TouchableOpacity
            onPress={onIconPress}
            style={styles.iconWrapper}
          >
            <Ionicons name={iconName} size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {maxLength && (
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    
    width: Dimensions.get("screen").width * 0.95,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 35,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingVertical: 16,
    paddingHorizontal: 20
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
    marginTop: 4,
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});

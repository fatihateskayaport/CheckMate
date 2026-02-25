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

interface CustomInputDetailProps {
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

const CustomInputDetail: React.FC<CustomInputDetailProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  multiline = true,
  numberOfLines = 5,
  maxLength,
  iconName,
  onIconPress,
}) => {
  return (
    <View style={styles.container}>

      
      <View style={[styles.inputWrapper, multiline && styles.multilineWrapper]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={`${placeholder} yazın...`}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          textAlignVertical="top" 
          style={[
            styles.input,
            multiline && { minHeight: 120 },
            error && styles.inputError,
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
            <Ionicons name={iconName} size={20} color="#5D5FEF" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInputDetail;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center' 
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '11%', 
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
    textTransform: 'uppercase'
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
  multilineWrapper: {
    paddingTop: 8, 
    paddingBottom: 8, 
  },
  input: {
    flex:1,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  inputError: {
    borderColor: "#ff4d4d",
  },
  iconWrapper: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  errorText: {
    color: "#ff4d4d",
    marginTop: 6,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '11%'
  },
  charCount: {
    position: "absolute",
    bottom: 10,
    right: 15,
    fontSize: 11,
    color: "#bbb",
  },
});
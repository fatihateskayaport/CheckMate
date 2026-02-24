import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {

  success: (props) => (
    <View style={{
      height: 60,
      width: '90%',
      backgroundColor: '#ECFDF5', 
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#10B981', 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    }}>
      <View style={{ 
        backgroundColor: '#10B981', 
        padding: 6, 
        borderRadius: 10,
        marginRight: 12 
      }}>
        <MaterialCommunityIcons name="check-bold" size={20} color="#fff" />
      </View>
      <View>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#064E3B' }}>{props.text1}</Text>
        {props.text2 && <Text style={{ fontSize: 12, color: '#065F46' }}>{props.text2}</Text>}
      </View>
    </View>
  ),


  error: (props) => (
    <View style={{
      height: 60,
      width: '90%',
      backgroundColor: '#FEF2F2',
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: '#EF4444',
    }}>
      <View style={{ 
        backgroundColor: '#EF4444', 
        padding: 6, 
        borderRadius: 10,
        marginRight: 12 
      }}>
        <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
      </View>
      <View>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#7F1D1D' }}>{props.text1}</Text>
        {props.text2 && <Text style={{ fontSize: 12, color: '#991B1B' }}>{props.text2}</Text>}
      </View>
    </View>
  )
};